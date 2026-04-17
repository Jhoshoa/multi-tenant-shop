import uuid
from datetime import datetime
from pydantic import BaseModel


class InventoryMovementOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    type: str
    quantity: int
    reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class InventoryAdjustRequest(BaseModel):
    product_id: uuid.UUID
    quantity: int          # positivo = entrada, negativo = salida
    reason: str | None = None


class StockSummaryItem(BaseModel):
    product_id: uuid.UUID
    product_name: str
    stock: int
    track_stock: bool
