import { Type } from "./type.model";
import { Status } from "./status.model";
import { User } from "src/app/infrastructure/auth/model/user.model";

export interface Project {
    id: number;
    name: string;
    description: string;
    durationMonths: number;
    budget: number;
    type: Type;
    status: Status;
    manager: User
}
