import { Accountant } from "./accountant.model";
import { DateRange } from "./date-range.model";

export interface OrganizationGoal {
    id: number;
    title: string;
    description: string;
    rationale: string;
    priority: number;
    validPeriod: DateRange;
    creator: Accountant;
}