import { UserContact } from "../../administration/model/user-contact.model";
import { Project } from "../../projects/model/project.model";

export interface Revenue { 
    id: number;
    createdOn: Date;
    type: string;
    amount: number;
    donator: UserContact;
    project: Project;
    //lecture
}