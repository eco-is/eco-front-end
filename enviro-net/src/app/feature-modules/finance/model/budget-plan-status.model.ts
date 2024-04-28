export enum BudgetPlanStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    ARCHIVED = 'ARCHIVED',
    CLOSED = 'CLOSED',
}

export const BudgetPlanStatusOrdinals = {
    [BudgetPlanStatus.DRAFT]: 0,
    [BudgetPlanStatus.PENDING]: 1,
    [BudgetPlanStatus.APPROVED]: 2,
    [BudgetPlanStatus.REJECTED]: 3,
    [BudgetPlanStatus.ARCHIVED]: 4,
    [BudgetPlanStatus.CLOSED]: 5,
};