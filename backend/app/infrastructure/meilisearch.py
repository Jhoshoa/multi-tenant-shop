import meilisearch
from app.core.config import settings

client = meilisearch.Client(settings.MEILISEARCH_URL, settings.MEILISEARCH_API_KEY)

PRODUCTS_INDEX = "products"


def get_products_index():
    return client.index(PRODUCTS_INDEX)


def index_product(product: dict) -> None:
    """Indexa o actualiza un producto en Meilisearch."""
    get_products_index().add_documents([product])


def delete_product(product_id: str) -> None:
    """Elimina un producto del índice."""
    get_products_index().delete_document(product_id)


def search_products(query: str, tenant_id: str, filters: dict | None = None) -> dict:
    """Busca productos filtrando siempre por tenant."""
    filter_str = f"tenant_id = {tenant_id}"
    if filters:
        if filters.get("category"):
            filter_str += f" AND category = {filters['category']}"
        if filters.get("min_price") is not None:
            filter_str += f" AND price >= {filters['min_price']}"
        if filters.get("max_price") is not None:
            filter_str += f" AND price <= {filters['max_price']}"
        if filters.get("is_active") is not None:
            filter_str += f" AND is_active = {str(filters['is_active']).lower()}"

    return get_products_index().search(
        query,
        {
            "filter": filter_str,
            "limit": filters.get("limit", 20) if filters else 20,
            "offset": filters.get("offset", 0) if filters else 0,
        },
    )


def setup_index() -> None:
    """Configura el índice de productos (ejecutar una vez)."""
    index = get_products_index()
    index.update_filterable_attributes(["tenant_id", "category", "price", "is_active"])
    index.update_searchable_attributes(["name", "description", "tags", "category"])
    index.update_sortable_attributes(["price", "created_at"])
