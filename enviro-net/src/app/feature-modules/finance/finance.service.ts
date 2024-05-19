import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { BudgetPlan } from './model/budget-plan.model';
import { OrganizationGoal } from './model/organization-goal.model';
import { OrganizationGoalsSet } from './model/organization-goals-set.model';
import { FixedExpenses } from './model/fixed-expenses.model';

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
        const params = this.buildParamsBudgetPlans(id, name, statuses, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<BudgetPlan>>(environment.apiHost + 'budget-plan/all-plans', { params });
    }
    private buildParamsBudgetPlans(id : number, name : string, statuses : string[], page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
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

    // OrganizationGoals
    createOrganizationGoal(goal: OrganizationGoal): Observable<OrganizationGoal> {
        return this.http.post<OrganizationGoal>(environment.apiHost + `goal/create`, goal);
    }

    getAllOrganizationGoals(page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<OrganizationGoalsSet>> {
        const params = this.buildParams(page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<OrganizationGoalsSet>>(environment.apiHost + 'goal/all', { params });
    }

    getCurrentOrganizationGoals(): Observable<OrganizationGoalsSet> {
        return this.http.get<OrganizationGoalsSet>(environment.apiHost + 'goal/current');
    }

    private buildParams(page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection);
        return params;
    }
    
    getOrganizationGoal(id : number): Observable<OrganizationGoal> {
        return this.http.get<OrganizationGoal>(environment.apiHost + 'goal/get/' + id);
    }

    updateOrganizationGoal(goal : OrganizationGoal): Observable<OrganizationGoal> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<OrganizationGoal>(environment.apiHost + 'goal/update', goal, options);
    }

    deleteOrganizationGoal(id : number): Observable<void> {
        return this.http.delete<void>(environment.apiHost + 'goal/delete/' + id);
    }

    publishOrganizationGoalsSet(goalSet : OrganizationGoalsSet): Observable<OrganizationGoalsSet> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<OrganizationGoalsSet>(environment.apiHost + 'goal/publish', goalSet, options);
    }

    // FixedExpenses
    lastMonthSalaryExpenses(creatorId : number, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<FixedExpenses>> {
        const params = this.buildParamsSalaryExpenses(creatorId, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<FixedExpenses>>(environment.apiHost + 'fixed-expenses/salary', { params });
    }
    private buildParamsSalaryExpenses(creatorId : number, page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('creatorId', creatorId.toString())
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection);
        return params;
    }

    createFixedExpense(expense : FixedExpenses) : Observable<FixedExpenses> {
        return this.http.post<FixedExpenses>(environment.apiHost + 'fixed-expenses/create', expense);
    }

    getAllFixedExpenses(types : string[], employees : number[], creators : number[], page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<FixedExpenses>> {
        const params = this.buildParamsFixedExpenses(types, employees, creators, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<FixedExpenses>>(environment.apiHost + 'fixed-expenses/all', { params });
    }

    private buildParamsFixedExpenses(types : string[], employees : number[], creators : number[], page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection);
        if (types && types.length > 0) {
            types.forEach(type => {
              params = params.append('types', type);
            });
        }
        if (employees && employees.length > 0) {
            employees.forEach(employee => {
              params = params.append('employees', employee);
            });
        }
        if (creators && creators.length > 0) {
            employees.forEach(creator => {
              params = params.append('creators', creator);
            });
        }
    
        return params;
    }

    getFixedExpense(id : number): Observable<FixedExpenses> {
        return this.http.get<FixedExpenses>(environment.apiHost + 'fixed-expenses/get/' + id);
    }

    updateSalaryExpense(salary : FixedExpenses): Observable<FixedExpenses> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<FixedExpenses>(environment.apiHost + 'fixed-expenses/update/salary', salary, options);
    }
    
    updateFixedExpense(expense : FixedExpenses): Observable<FixedExpenses> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<FixedExpenses>(environment.apiHost + 'fixed-expenses/update', expense, options);
    }

    deleteFixedExpense(id: number): Observable<void> {
        return this.http.delete<void>(environment.apiHost + 'fixed-expenses/delete/' + id);
    }
    
    //
}