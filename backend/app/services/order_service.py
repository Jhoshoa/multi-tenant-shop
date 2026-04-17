import uuid
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderStatusUpdate
from app.schemas.common import PaginatedResponse
from app.core.exceptions import NotFoundError, ValidationError
from app.helpers.pagination import PaginationParams

VALID_STATUSES = {"pending", "confirmed", "preparing", "ready", "delivered", "cancelled"}


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_orders(self, tenant_id: uuid.UUID, page: int = 1, page_size: int = 20, status: str | None = None):
        query = select(Order).where(Order.tenant_id == tenant_id).options(selectinload(Order.items))
        if status:
            query = query.where(Order.status == status)
        query = query.order_by(Order.created_at.desc())

        pagination = PaginationParams(page=page, page_size=page_size)
        results = (await self.db.execute(query.offset(pagination.offset).limit(pagination.limit))).scalars().all()
        return results

    async def get_order(self, tenant_id: uuid.UUID, order_id: uuid.UUID) -> Order:
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id, Order.tenant_id == tenant_id)
        )
        order = result.scalar_one_or_none()
        if not order:
            raise NotFoundError("Pedido")
        return order

    async def create_order(self, tenant_id: uuid.UUID, data: OrderCreate) -> Order:
        total = Decimal("0")
        items_to_create = []

        for item_data in data.items:
            product = (await self.db.execute(
                select(Product).where(Product.id == item_data.product_id, Product.tenant_id == tenant_id)
            )).scalar_one_or_none()

            if not product:
                raise NotFoundError(f"Producto {item_data.product_id}")
            if not product.is_active:
                raise ValidationError(f"Producto '{product.name}' no está disponible")

            subtotal = product.price * item_data.quantity
            total += subtotal
            items_to_create.append((product, item_data.quantity, subtotal))

        order = Order(
            tenant_id=tenant_id,
            customer_name=data.customer_name,
            customer_phone=data.customer_phone,
            customer_address=data.customer_address,
            notes=data.notes,
            status="pending",
            total=total,
        )
        self.db.add(order)
        await self.db.flush()

        for product, quantity, subtotal in items_to_create:
            self.db.add(OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                product_price=product.price,
                quantity=quantity,
                subtotal=subtotal,
            ))

        await self.db.flush()
        return order

    async def update_status(self, order: Order, data: OrderStatusUpdate) -> Order:
        if data.status not in VALID_STATUSES:
            raise ValidationError(f"Estado inválido. Opciones: {', '.join(VALID_STATUSES)}")
        order.status = data.status
        await self.db.flush()
        return order
