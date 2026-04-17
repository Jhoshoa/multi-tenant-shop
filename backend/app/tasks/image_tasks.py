from app.tasks.celery_app import celery_app
from app.infrastructure.cloudinary import delete_image


@celery_app.task(name="images.delete_from_cloudinary")
def delete_image_task(cloudinary_id: str) -> None:
    """Elimina una imagen de Cloudinary en background."""
    delete_image(cloudinary_id)
