import { Type } from "./type.model";

export interface ProjectCreation {
    name: string;
    description: string;
    durationMonths: number;
    budget: number;
    type: Type;
    managerId: number
}
