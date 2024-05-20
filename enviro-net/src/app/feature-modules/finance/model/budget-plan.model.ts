import { DateRange } from "./date-range.model";
import { Employee } from "./employee.model";

export interface BudgetPlan {
    id: number;
    name: string;
    description: string;
    status: string;
    lastUpdatedOnDate: Date;
    fiscalDateRange: DateRange;
    author: Employee;
}
