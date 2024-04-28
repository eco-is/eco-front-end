import { Accountant } from "./accountant.model";
import { DateRange } from "./date-range.model";

export interface BudgetPlan {
    id: number;
    name: string;
    description: string;
    status: string;
    lastUpdatedOnDate: Date;
    fiscalDateRange: DateRange;
    author: Accountant;
}
