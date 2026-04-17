from decimal import Decimal

CURRENCY_SYMBOLS = {
    "USD": "$",
    "EUR": "€",
    "MXN": "$",
    "COP": "$",
    "ARS": "$",
    "BRL": "R$",
}


def format_currency(amount: Decimal, currency: str = "USD") -> str:
    symbol = CURRENCY_SYMBOLS.get(currency, currency)
    return f"{symbol}{amount:,.2f}"
