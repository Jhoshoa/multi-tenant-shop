import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user, get_owner
from app.models.category import Category
from app.schemas.category import CategoryOut, CategoryCreate, CategoryUpdate
from app.schemas.common import MessageResponse
from app.helpers.slugify import unique_slug
from app.core.exceptions import NotFoundError, ConflictError

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=list[CategoryOut])
async def list_categories(current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    results = (await db.execute(
        select(Category)
        .where(Category.tenant_id == current_user.tenant_id)
        .order_by(Category.sort_order)
    )).scalars().all()
    return results


@router.post("/", response_model=CategoryOut, status_code=201)
async def create_category(
    data: CategoryCreate,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    slug = await unique_slug(db, Category, data.name)
    category = Category(
        tenant_id=current_user.tenant_id,
        slug=slug,
        **data.model_dump(),
    )
    db.add(category)
    await db.flush()
    await db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: uuid.UUID,
    data: CategoryUpdate,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    category = (await db.execute(
        select(Category).where(Category.id == category_id, Category.tenant_id == current_user.tenant_id)
    )).scalar_one_or_none()
    if not category:
        raise NotFoundError("Categoría")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(category, field, value)
    return category


@router.delete("/{category_id}", response_model=MessageResponse)
async def delete_category(
    category_id: uuid.UUID,
    current_user=Depends(get_owner),
    db: AsyncSession = Depends(get_db),
):
    from app.models.product import Product
    category = (await db.execute(
        select(Category).where(Category.id == category_id, Category.tenant_id == current_user.tenant_id)
    )).scalar_one_or_none()
    if not category:
        raise NotFoundError("Categoría")

    product_count = (await db.execute(
        select(Product).where(Product.category_id == category_id)
    )).first()
    if product_count:
        raise ConflictError("No se puede eliminar: la categoría tiene productos asociados")

    await db.delete(category)
    return MessageResponse(detail="Categoría eliminada")
