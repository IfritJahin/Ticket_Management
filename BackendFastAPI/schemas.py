from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TicketCreate(BaseModel):
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5_000)
    category: str | None = None
    urgency: str | None = None


class TicketStatusUpdate(BaseModel):
    status: Literal["open", "in_progress", "closed"]


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
