from contextvars import ContextVar
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.tenant import Tenant

_current_tenant: ContextVar[Optional["Tenant"]] = ContextVar("current_tenant", default=None)


def set_current_tenant(tenant: "Tenant") -> None:
    _current_tenant.set(tenant)


def get_current_tenant() -> "Tenant":
    tenant = _current_tenant.get()
    if tenant is None:
        raise RuntimeError("Tenant no resuelto en este contexto de request")
    return tenant
