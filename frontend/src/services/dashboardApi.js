import api from "./api";

// Get dashboard summary
export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

// Get category-wise expenses
export const getCategoryExpenses = async () => {
  const response = await api.get("/dashboard/categories");
  return response.data;
};

// Get monthly summary
export const getMonthlySummary = async () => {
  const response = await api.get("/dashboard/monthly");
  return response.data;
};