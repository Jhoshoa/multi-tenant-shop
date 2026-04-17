import uuid
from pydantic import BaseModel


class TenantSettingsOut(BaseModel):
    whatsapp: str | None
    instagram: str | None
    address: str | None
    business_hours: dict | None

    model_config = {"from_attributes": True}


class TenantOut(BaseModel):
    id: uuid.UUID
    slug: str
    name: str
    description: str | None
    logo_url: str | None
    banner_url: str | None
    currency: str
    plan: str
    is_active: bool
    settings: TenantSettingsOut | None

    model_config = {"from_attributes": True}


class TenantUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    logo_url: str | None = None
    banner_url: str | None = None
    currency: str | None = None


class TenantSettingsUpdate(BaseModel):
    whatsapp: str | None = None
    instagram: str | None = None
    address: str | None = None
    business_hours: dict | None = None


class TenantStats(BaseModel):
    total_products: int
    active_products: int
    total_orders: int
    total_categories: int
