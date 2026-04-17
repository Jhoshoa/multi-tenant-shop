from fastapi import Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


class NotFoundError(AppException):
    def __init__(self, resource: str = "Recurso"):
        super().__init__(404, f"{resource} no encontrado")


class ForbiddenError(AppException):
    def __init__(self, detail: str = "Acción no permitida"):
        super().__init__(403, detail)


class ConflictError(AppException):
    def __init__(self, detail: str):
        super().__init__(409, detail)


class UnauthorizedError(AppException):
    def __init__(self, detail: str = "No autenticado"):
        super().__init__(401, detail)


class ValidationError(AppException):
    def __init__(self, detail: str):
        super().__init__(422, detail)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
