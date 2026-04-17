import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr


class TenantAdminOut(BaseModel):
    id: uuid.UUID
    slug: str
    name: str
    plan: str
    is_active: bool
    status: str
    rejected_reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedTenants(BaseModel):
    items: list[TenantAdminOut]
    total: int
    limit: int
    offset: int


class TenantActionRequest(BaseModel):
    reason: str


class UserAdminOut(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    email: str
    full_name: str | None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedUsers(BaseModel):
    items: list[UserAdminOut]
    total: int
    limit: int
    offset: int
