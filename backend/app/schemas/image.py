import uuid
from pydantic import BaseModel


class ProductImageOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    cloudinary_id: str
    url: str
    thumbnail_url: str | None
    sort_order: int
    is_primary: bool

    model_config = {"from_attributes": True}


class ImageSignResponse(BaseModel):
    signature: str
    timestamp: int
    upload_preset: str
    cloud_name: str
    folder: str


class ImageRegisterRequest(BaseModel):
    cloudinary_id: str
    url: str
    thumbnail_url: str | None = None


class ImageReorderRequest(BaseModel):
    image_ids: list[uuid.UUID]   # orden deseado de mayor a menor prioridad
