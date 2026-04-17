import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.product import Product
from app.models.inventory import InventoryMovement
from app.schemas.inventory import InventoryAdjustRequest, StockSummaryItem
from app.core.exceptions import NotFoundError, ValidationError


class InventoryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def adjust_stock(self, tenant_id: uuid.UUID, data: InventoryAdjustRequest, user_id: uuid.UUID) -> Product:
        product = (await self.db.execute(
            select(Product).where(Product.id == data.product_id, Product.tenant_id == tenant_id)
        )).scalar_one_or_none()

        if not product:
            raise NotFoundError("Producto")

        new_stock = product.stock + data.quantity
        if new_stock < 0:
            raise ValidationError(f"Stock insuficiente. Stock actual: {product.stock}")

        product.stock = new_stock

        movement = InventoryMovement(
            tenant_id=tenant_id,
            product_id=product.id,
            type="in" if data.quantity > 0 else "out",
            quantity=abs(data.quantity),
            reason=data.reason,
            created_by=user_id,
        )
        self.db.add(movement)
        await self.db.flush()
        return product

    async def get_movements(self, tenant_id: uuid.UUID, product_id: uuid.UUID | None = None) -> list[InventoryMovement]:
        query = select(InventoryMovement).where(InventoryMovement.tenant_id == tenant_id)
        if product_id:
            query = query.where(InventoryMovement.product_id == product_id)
        query = query.order_by(InventoryMovement.created_at.desc()).limit(100)
        return (await self.db.execute(query)).scalars().all()

    async def get_low_stock(self, tenant_id: uuid.UUID, threshold: int = 5) -> list[StockSummaryItem]:
        results = (await self.db.execute(
            select(Product).where(
                Product.tenant_id == tenant_id,
                Product.track_stock.is_(True),
                Product.stock <= threshold,
                Product.is_active.is_(True),
            )
        )).scalars().all()

        return [
            StockSummaryItem(
                product_id=p.id,
                product_name=p.name,
                stock=p.stock,
                track_stock=p.track_stock,
            )
            for p in results
        ]
