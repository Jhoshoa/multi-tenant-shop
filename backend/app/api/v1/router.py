from fastapi import APIRouter
from app.api.v1 import auth, tenants, invitations, admin, categories, products, images, inventory, search, orders, notifications

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(tenants.router)
api_router.include_router(invitations.router)
api_router.include_router(admin.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(images.router)
api_router.include_router(inventory.router)
api_router.include_router(search.router)
api_router.include_router(orders.router)
api_router.include_router(notifications.router)
