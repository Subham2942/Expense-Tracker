import { apiRequest } from '@/services/api-client';

export type Expense = {
  external_id: string;
  amount: number;
  merchant?: string;
  currency: string;
  created_at?: string;
};

export type ExpenseInput = {
  amount: number;
  merchant?: string;
  currency: string;
};

export type UpdateExpenseInput = ExpenseInput & {
  external_id: string;
};

export type DeleteExpenseInput = {
  external_id: string;
}

export async function getExpenses(): Promise<Expense[]> {
  const response = await apiRequest('/expense/v1/getExpense');
  if (!response.ok) throw new Error('Unable to load expenses.');
  return response.json();
}

export async function addExpense(expense: ExpenseInput) {
  const response = await apiRequest('/expense/v1/addExpense', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error('Unable to add expense.');
}

export async function updateExpense(expense: UpdateExpenseInput) {
  const response = await apiRequest('/expense/v1/updateExpense', {
    method: 'PUT',
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error('Unable to update expense.');
}

export async function deleteExpense(expense: DeleteExpenseInput){
  const response = await apiRequest("/expense/v1/deleteExpense", {
    method: 'DELETE',
    body: JSON.stringify(expense),
  });
  if(!response.ok) throw new Error('Unable to delete expense');
}