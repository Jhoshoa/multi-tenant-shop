import uuid
from decimal import Decimal
from pydantic import BaseModel
from app.schemas.image import ProductImageOut


class ProductOut(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    category_id: uuid.UUID | None
    name: str
    description: str | None
    price: Decimal
    compare_price: Decimal | None
    sku: str | None
    barcode: str | None
    stock: int
    track_stock: bool
    is_active: bool
    is_featured: bool
    tags: list[str] | None
    extra_data: dict | None
    images: list[ProductImageOut] = []

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    compare_price: Decimal | None = None
    category_id: uuid.UUID | None = None
    sku: str | None = None
    barcode: str | None = None
    stock: int = 0
    track_stock: bool = False
    is_featured: bool = False
    tags: list[str] | None = None
    extra_data: dict | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    compare_price: Decimal | None = None
    category_id: uuid.UUID | None = None
    sku: str | None = None
    barcode: str | None = None
    stock: int | None = None
    track_stock: bool | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    tags: list[str] | None = None
    extra_data: dict | None = None


class ProductFilters(BaseModel):
    page: int = 1
    page_size: int = 20
    category_id: uuid.UUID | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
    search: str | None = None
