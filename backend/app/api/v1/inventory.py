import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user, get_staff
from app.schemas.inventory import InventoryAdjustRequest, InventoryMovementOut, StockSummaryItem
from app.services.inventory_service import InventoryService

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.post("/adjust", response_model=dict)
async def adjust_stock(
    data: InventoryAdjustRequest,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = InventoryService(db)
    product = await service.adjust_stock(current_user.tenant_id, data, current_user.id)
    return {"product_id": str(product.id), "new_stock": product.stock}


@router.get("/movements", response_model=list[InventoryMovementOut])
async def get_movements(
    product_id: uuid.UUID | None = Query(None),
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = InventoryService(db)
    return await service.get_movements(current_user.tenant_id, product_id)


@router.get("/low-stock", response_model=list[StockSummaryItem])
async def get_low_stock(
    threshold: int = Query(5, ge=0),
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = InventoryService(db)
    return await service.get_low_stock(current_user.tenant_id, threshold)
