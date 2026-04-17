from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.category import Category
from app.models.tenant import Tenant

CATEGORIES = [
    {"name": "Ropa",        "slug": "ropa"},
    {"name": "Calzado",     "slug": "calzado"},
    {"name": "Accesorios",  "slug": "accesorios"},
    {"name": "Electrónica", "slug": "electronica"},
    {"name": "Hogar",       "slug": "hogar"},
]


async def seed_categories(db: AsyncSession, tenant: Tenant) -> list[Category]:
    existing = (await db.execute(
        select(Category).where(Category.tenant_id == tenant.id)
    )).scalars().all()

    if existing:
        print(f"  ⚠️  Categorías ya existen ({len(existing)}), omitiendo.")
        return list(existing)

    categories = []
    for i, data in enumerate(CATEGORIES):
        cat = Category(
            tenant_id=tenant.id,
            is_active=True,
            sort_order=i,
            **data,
        )
        db.add(cat)
        categories.append(cat)

    await db.flush()
    for c in categories:
        await db.refresh(c)

    print(f"  ✅ {len(categories)} categorías creadas.")
    return categories
