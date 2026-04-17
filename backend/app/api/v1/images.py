import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user, get_staff
from app.core.context import get_current_tenant
from app.schemas.image import ImageSignResponse, ImageRegisterRequest, ImageReorderRequest, ProductImageOut
from app.schemas.common import MessageResponse
from app.services.image_service import ImageService
from app.services.product_service import ProductService

router = APIRouter(prefix="/products/{product_id}/images", tags=["images"])


@router.post("/sign", response_model=ImageSignResponse)
async def sign_upload(
    product_id: uuid.UUID,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    # Validar que el producto pertenece al tenant
    product_service = ProductService(db)
    await product_service.get_product(current_user.tenant_id, product_id)

    tenant = get_current_tenant()
    image_service = ImageService(db)
    return image_service.sign_upload(tenant.slug, product_id)


@router.post("/", response_model=ProductImageOut, status_code=201)
async def register_image(
    product_id: uuid.UUID,
    data: ImageRegisterRequest,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ImageService(db)
    return await service.register_image(product_id, data)


@router.delete("/{image_id}", response_model=MessageResponse)
async def delete_image(
    product_id: uuid.UUID,
    image_id: uuid.UUID,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ImageService(db)
    await service.delete_image(product_id, image_id)
    return MessageResponse(detail="Imagen eliminada")


@router.patch("/reorder", response_model=MessageResponse)
async def reorder_images(
    product_id: uuid.UUID,
    data: ImageReorderRequest,
    current_user=Depends(get_staff),
    db: AsyncSession = Depends(get_db),
):
    service = ImageService(db)
    await service.reorder_images(product_id, data.image_ids)
    return MessageResponse(detail="Orden actualizado")
