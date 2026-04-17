import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductFilters
from app.schemas.common import PaginatedResponse
from app.core.exceptions import NotFoundError
from app.helpers.pagination import PaginationParams


class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_products(self, tenant_id: uuid.UUID, filters: ProductFilters) -> PaginatedResponse:
        query = (
            select(Product)
            .options(selectinload(Product.images))
            .where(Product.tenant_id == tenant_id)
        )

        if filters.category_id:
            query = query.where(Product.category_id == filters.category_id)
        if filters.is_active is not None:
            query = query.where(Product.is_active == filters.is_active)
        if filters.is_featured is not None:
            query = query.where(Product.is_featured == filters.is_featured)
        if filters.search:
            query = query.where(Product.name.ilike(f"%{filters.search}%"))

        total = (await self.db.execute(select(func.count()).select_from(query.subquery()))).scalar() or 0

        pagination = PaginationParams(page=filters.page, page_size=filters.page_size)
        results = (await self.db.execute(query.offset(pagination.offset).limit(pagination.limit))).scalars().all()

        return PaginatedResponse(
            items=list(results),
            total=total,
            page=filters.page,
            page_size=filters.page_size,
            pages=max(1, -(-total // filters.page_size)),
        )

    async def get_product(self, tenant_id: uuid.UUID, product_id: uuid.UUID) -> Product:
        result = await self.db.execute(
            select(Product)
            .options(selectinload(Product.images))
            .where(Product.id == product_id, Product.tenant_id == tenant_id)
        )
        product = result.scalar_one_or_none()
        if not product:
            raise NotFoundError("Producto")
        return product

    async def create_product(self, tenant_id: uuid.UUID, data: ProductCreate) -> Product:
        product = Product(tenant_id=tenant_id, **data.model_dump())
        self.db.add(product)
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def update_product(self, product: Product, data: ProductUpdate) -> Product:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(product, field, value)
        await self.db.flush()
        return product

    async def delete_product(self, product: Product) -> None:
        product.is_active = False   # soft delete
        await self.db.flush()

    async def toggle_active(self, product: Product) -> Product:
        product.is_active = not product.is_active
        await self.db.flush()
        return product

    async def duplicate_product(self, tenant_id: uuid.UUID, product: Product) -> Product:
        new_product = Product(
            tenant_id=tenant_id,
            category_id=product.category_id,
            name=f"{product.name} (copia)",
            description=product.description,
            price=product.price,
            compare_price=product.compare_price,
            stock=0,
            track_stock=product.track_stock,
            tags=product.tags,
            metadata=product.metadata,
            is_active=False,
        )
        self.db.add(new_product)
        await self.db.flush()
        return new_product
