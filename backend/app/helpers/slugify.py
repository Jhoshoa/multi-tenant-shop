from slugify import slugify as _slugify
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func


async def unique_slug(db: AsyncSession, model, base: str, exclude_id=None) -> str:
    """Genera un slug único para el modelo dado."""
    slug = _slugify(base)
    query = select(func.count()).where(model.slug.like(f"{slug}%"))
    if exclude_id:
        query = query.where(model.id != exclude_id)
    count = (await db.execute(query)).scalar() or 0
    return slug if count == 0 else f"{slug}-{count}"
