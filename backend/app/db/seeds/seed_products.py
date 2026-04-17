from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.product import Product
from app.models.category import Category
from app.models.tenant import Tenant

PRODUCTS = [
    {"name": "Camiseta Básica Blanca",    "price": Decimal("12.99"), "stock": 50, "cat_slug": "ropa",        "is_featured": True},
    {"name": "Camiseta Negra Premium",    "price": Decimal("18.99"), "stock": 30, "cat_slug": "ropa",        "is_featured": False},
    {"name": "Zapatilla Running Pro",     "price": Decimal("59.99"), "stock": 20, "cat_slug": "calzado",     "is_featured": True},
    {"name": "Zapato Casual Cuero",       "price": Decimal("79.99"), "stock": 15, "cat_slug": "calzado",     "is_featured": False},
    {"name": "Reloj Deportivo Negro",     "price": Decimal("29.99"), "stock": 25, "cat_slug": "accesorios",  "is_featured": True},
    {"name": "Cartera de Cuero Marrón",   "price": Decimal("34.99"), "stock": 18, "cat_slug": "accesorios",  "is_featured": False},
    {"name": "Audífonos Inalámbricos",    "price": Decimal("45.00"), "stock": 10, "cat_slug": "electronica", "is_featured": True},
    {"name": "Cargador Rápido USB-C",     "price": Decimal("15.99"), "stock": 40, "cat_slug": "electronica", "is_featured": False},
    {"name": "Lámpara de Escritorio LED", "price": Decimal("22.50"), "stock": 12, "cat_slug": "hogar",       "is_featured": False},
    {"name": "Organizador de Escritorio", "price": Decimal("18.00"), "stock": 8,  "cat_slug": "hogar",       "is_featured": False},
]


async def seed_products(db: AsyncSession, tenant: Tenant, categories: list[Category]) -> None:
    existing_count = (await db.execute(
        select(Product).where(Product.tenant_id == tenant.id)
    )).scalars().all()

    if existing_count:
        print(f"  ⚠️  Productos ya existen ({len(existing_count)}), omitiendo.")
        return

    cat_by_slug = {c.slug: c for c in categories}

    for data in PRODUCTS:
        cat_slug = data.pop("cat_slug")
        cat = cat_by_slug.get(cat_slug)
        product = Product(
            tenant_id=tenant.id,
            category_id=cat.id if cat else None,
            is_active=True,
            track_stock=True,
            description=f"Descripción de ejemplo para {data['name']}.",
            tags=[cat_slug, "demo"],
            extra_data=None,
            **data,
        )
        db.add(product)

    await db.flush()
    print(f"  ✅ {len(PRODUCTS)} productos creados.")
