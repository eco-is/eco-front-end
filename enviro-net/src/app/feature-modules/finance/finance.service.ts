import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { BudgetPlan } from './model/budget-plan.model';

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    constructor(private http: HttpClient) { }

    // BudgetPlan
    createBudgetPlan(newPlan: BudgetPlan): Observable<BudgetPlan> {
        return this.http.post<BudgetPlan>(environment.apiHost + `budget-plan/create`, newPlan);
    }
    
    getAllBudgetPlans(id : number, name: string, statuses : string[], page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<BudgetPlan>> {
        const params = this.buildParams(id, name, statuses, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<BudgetPlan>>(environment.apiHost + 'budget-plan/all-plans', { params });
    }

    private buildParams(id : number, name : string, statuses : string[], page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('id', id)
          .set('name', name)
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection);
        if (statuses && statuses.length > 0) {
            statuses.forEach(status => {
              params = params.append('statuses', status);
            });
        }
    
        return params;
    }

    getBudgetPlan(id : number): Observable<BudgetPlan> {
        return this.http.get<BudgetPlan>(environment.apiHost + 'budget-plan/get-budget/' + id);
    }

    updateBudgetPlan(plan : BudgetPlan): Observable<BudgetPlan> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<BudgetPlan>(environment.apiHost + 'budget-plan/update', plan, options);
    }

    archiveBudgetPlan(plan : BudgetPlan): Observable<void> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<void>(environment.apiHost + `budget-plan/archive`, plan, options);
    }

    closeBudgetPlan(plan : BudgetPlan): Observable<void> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<void>(environment.apiHost + `budget-plan/close`, plan, options);
    }

    
}