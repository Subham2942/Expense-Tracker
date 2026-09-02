export type Expense = {
  external_id: string;
  amount: number;
  user_id: string;
  merchant: string | null;
  currency: string;
  created_at: string;
};

export type CreateExpenseRequest = {
  amount: number;
  merchant?: string;
};
