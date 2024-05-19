import { DateRange } from "./date-range.model";
import { Accountant } from "./accountant.model";
import { Employee } from "./employee.model";

export interface FixedExpenses {
    id: number;
    type : string;
    period : DateRange;
    amount : number;
    creator : Accountant;
    createdOn : Date;
    description : string;
    employee : Employee;
    overtimeHours : number;
}