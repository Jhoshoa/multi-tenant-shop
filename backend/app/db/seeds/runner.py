import asyncio
from app.db.session import AsyncSessionLocal
from app.db.seeds.seed_tenants import seed_tenants
from app.db.seeds.seed_users import seed_users
from app.db.seeds.seed_categories import seed_categories
from app.db.seeds.seed_products import seed_products

# Import all models so SQLAlchemy can resolve relationships between them
import app.models.tenant        # noqa: F401
import app.models.user          # noqa: F401
import app.models.category      # noqa: F401
import app.models.product       # noqa: F401
import app.models.product_image # noqa: F401
import app.models.inventory     # noqa: F401
import app.models.order         # noqa: F401
import app.models.notification  # noqa: F401


async def run_seeds():
    async with AsyncSessionLocal() as db:
        print("🌱 Ejecutando seeders...")
        tenant = await seed_tenants(db)
        await seed_users(db, tenant)
        categories = await seed_categories(db, tenant)
        await seed_products(db, tenant, categories)
        await db.commit()
        print("✅ Seeders completados.")


if __name__ == "__main__":
    asyncio.run(run_seeds())
