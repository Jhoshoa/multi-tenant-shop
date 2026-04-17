import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Literal


class InvitationCreate(BaseModel):
    email: EmailStr
    role: Literal["staff", "owner"] = "staff"


class InvitationOut(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    email: str
    role: str
    expires_at: datetime
    consumed_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class InvitationValidation(BaseModel):
    """Returned by the public GET /invitations/{token} endpoint."""
    valid: bool
    email: str
    role: str
    tenant_name: str
