import uuid
from pydantic import BaseModel


class CategoryOut(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    parent_id: uuid.UUID | None
    name: str
    slug: str
    image_url: str | None
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    name: str
    parent_id: uuid.UUID | None = None
    image_url: str | None = None
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: str | None = None
    parent_id: uuid.UUID | None = None
    image_url: str | None = None
    sort_order: int | None = None
    is_active: bool | None = None
