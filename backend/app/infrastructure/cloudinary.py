import time
import hashlib
import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def generate_signature(folder: str) -> dict:
    """Genera una firma para que el cliente suba directamente a Cloudinary."""
    timestamp = int(time.time())
    params = f"folder={folder}&timestamp={timestamp}{settings.CLOUDINARY_API_SECRET}"
    signature = hashlib.sha1(params.encode()).hexdigest()
    return {
        "signature": signature,
        "timestamp": timestamp,
        "upload_preset": None,
        "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
        "folder": folder,
    }


def delete_image(public_id: str) -> dict:
    """Elimina una imagen de Cloudinary por su public_id."""
    return cloudinary.uploader.destroy(public_id)


def get_thumbnail_url(url: str, width: int = 400, height: int = 400) -> str:
    """Genera URL de thumbnail usando transformaciones de Cloudinary."""
    return url.replace("/upload/", f"/upload/w_{width},h_{height},c_fill,q_auto,f_auto/")
