import uuid
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class OrderItemOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID | None
    product_name: str
    product_price: Decimal
    quantity: int
    subtotal: Decimal

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: uuid.UUID
    tenant_id: uuid.UUID
    customer_name: str
    customer_phone: str | None
    customer_address: str | None
    status: str
    total: Decimal
    notes: str | None
    created_at: datetime
    items: list[OrderItemOut] = []

    model_config = {"from_attributes": True}


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str | None = None
    customer_address: str | None = None
    notes: str | None = None
    items: list[OrderItemCreate]


class OrderStatusUpdate(BaseModel):
    status: str   # pending | confirmed | preparing | ready | delivered | cancelled
