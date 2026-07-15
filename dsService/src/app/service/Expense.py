from typing import Optional
from pydantic import BaseModel, Field

class Expense(BaseModel):
    """Information about a transaction made on any card."""

    amount: Optional[str] = Field(
        default=None,
        title="expense",
        description="Amount spent in the transaction without any currency symbol, only the amount.",
    )
    merchant: Optional[str] = Field(
        default=None,
        title="merchant",
        description="Merchant where the transaction was made",
    )
    currency: Optional[str] = Field(
        default=None,
        title="currency",
        description="Currency of the transaction",
    )
    
