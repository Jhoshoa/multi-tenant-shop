from app.infrastructure import meilisearch as ms


class SearchService:
    def search(self, query: str, tenant_id: str, category: str | None = None,
               min_price: float | None = None, max_price: float | None = None,
               page: int = 1, page_size: int = 20) -> dict:

        filters = {
            "category": category,
            "min_price": min_price,
            "max_price": max_price,
            "limit": page_size,
            "offset": (page - 1) * page_size,
        }
        return ms.search_products(query, tenant_id, filters)

    def suggestions(self, query: str, tenant_id: str) -> dict:
        return ms.search_products(query, tenant_id, {"limit": 5, "offset": 0})
