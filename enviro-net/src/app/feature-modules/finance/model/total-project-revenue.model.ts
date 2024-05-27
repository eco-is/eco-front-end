import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Revenue } from "./revenue.mode";

export interface TotalProjectRevenue {
    content: PagedResults<Revenue>;
    totalAmount: number;
}