import { BudgetPlan } from "./budget-plan.model";
import { FixedExpenses } from "./fixed-expenses.model";

export interface FixedExpensesEstimation {
    id: number;
    budgetPlan: BudgetPlan;
    fixedExpense: FixedExpenses;
}