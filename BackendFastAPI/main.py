from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from auth import get_current_user, require_admin
from database import Base, engine, get_db
from models import User, Ticket
from schemas import (
    RegisterRequest,
    UserResponse,
    LoginRequest,
    TicketCreate,
    TicketResponse,
    TicketStatusUpdate,
    UserRoleUpdate,
    BootstrapAdminRequest,
)
from auth import hash_password, verify_password, create_access_token
from ai_service import categorize_ticket
# from fastapi.security import OAuth2PasswordRequestForm

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/auth/register",response_model=UserResponse
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@app.post("/api/auth/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/api/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@app.post("/api/auth/bootstrap-admin", response_model=UserResponse)
def bootstrap_admin(data: BootstrapAdminRequest, db: Session = Depends(get_db)):
    """Promote an existing account only when the system has no admin yet."""
    existing_admin = db.query(User).filter(User.role == "admin").first()
    if existing_admin:
        raise HTTPException(status_code=403, detail="An admin account already exists")

    user = db.query(User).filter(User.email == data.email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = "admin"
    db.commit()
    db.refresh(user)
    return user


@app.patch("/api/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_admin.id and data.role != "admin":
        raise HTTPException(status_code=400, detail="You cannot remove your own admin role")

    user.role = data.role
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/tickets", response_model=TicketResponse, status_code=201)
def create_ticket(
    data: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    triage = categorize_ticket(data.subject, data.message)
    ticket = Ticket(
        user_id=current_user.id,
        subject=data.subject,
        message=data.message,
        category=triage["category"],
        urgency=triage["urgency"],
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@app.get("/api/tickets", response_model=list[TicketResponse])
def list_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Ticket)
    if current_user.role != "admin":
        query = query.filter(Ticket.user_id == current_user.id)

    return query.order_by(Ticket.id.desc()).all()


@app.patch("/api/tickets/{ticket_id}/status", response_model=TicketResponse)
def update_ticket_status(
    ticket_id: int,
    data: TicketStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = data.status
    db.commit()
    db.refresh(ticket)
    return ticket

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"message": "Database connection works"}
