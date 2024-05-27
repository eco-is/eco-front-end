import { Project } from "../../projects/model/project.model";
import { UserContact } from "../../administration/model/user-contact.model";

export interface ProjectBudget {
    id: number;
    project: Project;
    creator: UserContact;
    totalRevenuesAmount: number;
    totalExpensesAmount: number;
}