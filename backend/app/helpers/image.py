ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 10
MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024


def validate_image(content_type: str, size_bytes: int) -> None:
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError(f"Tipo no permitido: {content_type}. Usa JPEG, PNG o WebP.")
    if size_bytes > MAX_SIZE_BYTES:
        raise ValueError(f"La imagen supera el límite de {MAX_SIZE_MB}MB.")
