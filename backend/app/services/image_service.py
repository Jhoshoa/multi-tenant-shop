import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.models.product_image import ProductImage
from app.schemas.image import ImageRegisterRequest, ImageSignResponse
from app.infrastructure import cloudinary as cdn
from app.core.exceptions import NotFoundError


class ImageService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def sign_upload(self, tenant_slug: str, product_id: uuid.UUID) -> ImageSignResponse:
        folder = f"{tenant_slug}/products/{product_id}"
        sig_data = cdn.generate_signature(folder)
        return ImageSignResponse(**sig_data)

    async def register_image(self, product_id: uuid.UUID, data: ImageRegisterRequest) -> ProductImage:
        thumbnail_url = data.thumbnail_url or cdn.get_thumbnail_url(data.url)

        # Primera imagen siempre es la primaria
        existing_count = (await self.db.execute(
            select(ProductImage).where(ProductImage.product_id == product_id)
        )).scalars().all()

        image = ProductImage(
            product_id=product_id,
            cloudinary_id=data.cloudinary_id,
            url=data.url,
            thumbnail_url=thumbnail_url,
            sort_order=len(existing_count),
            is_primary=len(existing_count) == 0,
        )
        self.db.add(image)
        await self.db.flush()
        return image

    async def delete_image(self, product_id: uuid.UUID, image_id: uuid.UUID) -> None:
        result = await self.db.execute(
            select(ProductImage).where(ProductImage.id == image_id, ProductImage.product_id == product_id)
        )
        image = result.scalar_one_or_none()
        if not image:
            raise NotFoundError("Imagen")

        cdn.delete_image(image.cloudinary_id)
        await self.db.delete(image)
        await self.db.flush()

    async def reorder_images(self, product_id: uuid.UUID, image_ids: list[uuid.UUID]) -> None:
        for order, image_id in enumerate(image_ids):
            await self.db.execute(
                update(ProductImage)
                .where(ProductImage.id == image_id, ProductImage.product_id == product_id)
                .values(sort_order=order, is_primary=(order == 0))
            )
        await self.db.flush()
