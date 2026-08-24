import { deleteRequest, getRequest, postRequest } from "./fetchHelper";
import type { CreateExpenseRequest, Expense } from "../types/ExpenseTypes";

const expenseApiUrlPath = "/expense/v1";

export const fetchExpense = async (): Promise<Expense[]> => {
  const response = getRequest<Expense[]>(`${expenseApiUrlPath}/getExpense`);
  return response;
};

export const addExpense = (
  expense: CreateExpenseRequest,
): Promise<boolean> => {
  return postRequest<boolean, CreateExpenseRequest>(
    `${expenseApiUrlPath}/addExpense`,
    expense,
  );
};

export const deleteExpense = (externalId: string): Promise<boolean> => {
  const encodedExternalId = encodeURIComponent(externalId);

  return deleteRequest<boolean>(
    `${expenseApiUrlPath}/deleteExpense?external_id=${encodedExternalId}`,
  );
};
