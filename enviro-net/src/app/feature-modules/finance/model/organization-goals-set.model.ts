import { DateRange } from "./date-range.model";
import { OrganizationGoal } from "./organization-goal.model";

export interface OrganizationGoalsSet {
    validPeriod: DateRange;
    goals: OrganizationGoal[];
    status: string;
}