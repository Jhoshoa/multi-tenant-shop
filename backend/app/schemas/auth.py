import uuid
from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    email: EmailStr
    full_name: str | None
    avatar_url: str | None
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class SyncUserRequest(BaseModel):
    """Payload enviado por la app tras el registro en Supabase."""
    full_name: str | None = None
    tenant_name: str | None = None   # Si quiere crear una tienda nueva


class SyncUserResponse(BaseModel):
    user_id: uuid.UUID
    tenant_id: uuid.UUID
