import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user, get_staff
from app.schemas.order import OrderOut, OrderCreate, OrderStatusUpdate
from app.schemas.common import MessageResponse
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=list[OrderOut])
async def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.list_orders(current_user.tenant_id, page, page_size, status)


@router.post("/", response_model=OrderOut, status_code=201)
async def create_order(
    data: OrderCreate,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.create_order(current_user.tenant_id, data)


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: uuid.UUID,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.get_order(current_user.tenant_id, order_id)


@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: uuid.UUID,
    data: OrderStatusUpdate,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    order = await service.get_order(current_user.tenant_id, order_id)
    return await service.update_status(order, data)
