from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["search"])


@router.get("/")
async def search_products(
    q: str = Query(..., min_length=1),
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user=Depends(get_current_user),
):
    service = SearchService()
    return service.search(
        query=q,
        tenant_id=str(current_user.tenant_id),
        category=category,
        min_price=min_price,
        max_price=max_price,
        page=page,
        page_size=page_size,
    )


@router.get("/suggestions")
async def search_suggestions(
    q: str = Query(..., min_length=1),
    current_user=Depends(get_current_user),
):
    service = SearchService()
    return service.suggestions(q, str(current_user.tenant_id))
