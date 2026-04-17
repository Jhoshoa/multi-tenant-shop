from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.tenant import Tenant, TenantSettings


async def seed_tenants(db: AsyncSession) -> Tenant:
    existing = (await db.execute(
        select(Tenant).where(Tenant.slug == "demo-store")
    )).scalar_one_or_none()

    if existing:
        print("  ⚠️  Tenant demo ya existe, omitiendo.")
        return existing

    tenant = Tenant(
        slug="demo-store",
        name="Demo Store",
        description="Tienda de demostración del sistema",
        currency="USD",
        plan="free",
        is_active=True,
        status="active",
    )
    db.add(tenant)
    await db.flush()

    settings = TenantSettings(
        tenant_id=tenant.id,
        whatsapp="+1234567890",
        instagram="@demostore",
        address="123 Demo St, Ciudad",
        business_hours={
            "mon": "9:00-18:00",
            "tue": "9:00-18:00",
            "wed": "9:00-18:00",
            "thu": "9:00-18:00",
            "fri": "9:00-18:00",
            "sat": "10:00-14:00",
            "sun": "closed",
        },
    )
    db.add(settings)
    await db.flush()
    await db.refresh(tenant)

    print(f"  ✅ Tenant creado: {tenant.slug}")
    return tenant
