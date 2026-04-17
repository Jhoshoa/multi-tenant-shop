from app.tasks.celery_app import celery_app
from app.infrastructure import meilisearch as ms


@celery_app.task(name="search.index_product")
def index_product_task(product_data: dict) -> None:
    """Indexa un producto en Meilisearch en background."""
    ms.index_product(product_data)


@celery_app.task(name="search.delete_product")
def delete_product_task(product_id: str) -> None:
    """Elimina un producto del índice Meilisearch."""
    ms.delete_product(product_id)


@celery_app.task(name="search.setup_index")
def setup_index_task() -> None:
    """Configura el índice de productos (ejecutar una vez en setup)."""
    ms.setup_index()
