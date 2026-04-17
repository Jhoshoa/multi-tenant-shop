import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user, get_owner, get_staff
from app.schemas.product import ProductOut, ProductCreate, ProductUpdate, ProductFilters
from app.schemas.common import PaginatedResponse, MessageResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=PaginatedResponse[ProductOut])
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: uuid.UUID | None = None,
    is_active: bool | None = None,
    is_featured: bool | None = None,
    search: str | None = None,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    filters = ProductFilters(
        page=page, page_size=page_size,
        category_id=category_id, is_active=is_active,
        is_featured=is_featured, search=search,
    )
    service = ProductService(db)
    return await service.list_products(current_user.tenant_id, filters)


@router.post("/", response_model=ProductOut, status_code=201)
async def create_product(
    data: ProductCreate,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    return await service.create_product(current_user.tenant_id, data)


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(
    product_id: uuid.UUID,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    return await service.get_product(current_user.tenant_id, product_id)


@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: uuid.UUID,
    data: ProductUpdate,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    product = await service.get_product(current_user.tenant_id, product_id)
    return await service.update_product(product, data)


@router.delete("/{product_id}", response_model=MessageResponse)
async def delete_product(
    product_id: uuid.UUID,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    product = await service.get_product(current_user.tenant_id, product_id)
    await service.delete_product(product)
    return MessageResponse(detail="Producto desactivado")


@router.patch("/{product_id}/toggle", response_model=ProductOut)
async def toggle_product(
    product_id: uuid.UUID,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    product = await service.get_product(current_user.tenant_id, product_id)
    return await service.toggle_active(product)


@router.post("/{product_id}/duplicate", response_model=ProductOut, status_code=201)
async def duplicate_product(
    product_id: uuid.UUID,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    product = await service.get_product(current_user.tenant_id, product_id)
    return await service.duplicate_product(current_user.tenant_id, product)
