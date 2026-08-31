from typing import Literal

from pydantic import BaseModel


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TicketCreate(BaseModel):
    subject: str
    message: str
    category: str | None = None
    urgency: str | None = None


class TicketStatusUpdate(BaseModel):
    status: str


class UserRoleUpdate(BaseModel):
    role: Literal["user", "admin"]


class BootstrapAdminRequest(BaseModel):
    email: str


class TicketResponse(BaseModel):
    id: int
    user_id: int
    subject: str
    message: str
    status: str
    category: str | None = None
    urgency: str | None = None

    class Config:
        from_attributes = True
