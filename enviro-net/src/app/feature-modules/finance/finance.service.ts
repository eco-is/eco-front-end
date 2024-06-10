import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { saveAs } from 'file-saver';
import { DateRange } from './model/date-range.model';
import { BudgetPlan } from './model/budget-plan.model';
import { OrganizationGoal } from './model/organization-goal.model';
import { OrganizationGoalsSet } from './model/organization-goals-set.model';
import { FixedExpenses } from './model/fixed-expenses.model';
import { FixedExpensesEstimation } from './model/fixed-expenses-estimation.model';
import { Revenue } from './model/revenue.mode';
import { TotalProjectRevenue } from './model/total-project-revenue.model';
import { ProjectBudget } from './model/project-budget.model';

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    constructor(private http: HttpClient) { }

    // BudgetPlan
    createBudgetPlan(newPlan: BudgetPlan): Observable<BudgetPlan> {
        return this.http.post<BudgetPlan>(environment.apiHost + `budget-plan/create`, newPlan);
    }
    
    getAllBudgetPlans(id : number, name: string, period: DateRange, statuses : string[], authors : number[], page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<BudgetPlan>> {
        const params = this.buildParamsBudgetPlans(id, name, period, statuses, authors, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<BudgetPlan>>(environment.apiHost + 'budget-plan/all-plans', { params });
    }
    private buildParamsBudgetPlans(id : number, name : string, period: DateRange, statuses : string[], authors : number[], page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('id', id)
          .set('name', name)
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection)
          .set('period', JSON.stringify(period));
        if (statuses && statuses.length > 0) {
            statuses.forEach(status => {
              params = params.append('statuses', status);
            });
        }
        if (authors && authors.length > 0) {
            authors.forEach(author => {
              params = params.append('authors', author);
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

    getAllOrganizationGoals(title : string, period : DateRange, statuses : string[], creators : number[], page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<OrganizationGoalsSet>> {
        const params = this.buildParamsOrganizationGoals(title, period, statuses, creators, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<OrganizationGoalsSet>>(environment.apiHost + 'goal/all', { params });
    }
    private buildParamsOrganizationGoals(title : string, period : DateRange, statuses : string[], creators : number[], page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
        .set('title', title)
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sortBy)
        .set('direction', sortDirection)
        .set('period', JSON.stringify(period));
      if (statuses && statuses.length > 0) {
          statuses.forEach(status => {
            params = params.append('statuses', status);
          });
      }
      if (creators && creators.length > 0) {
            creators.forEach(creator => {
            params = params.append('creators', creator);
          });
      }
  
      return params;
    }

    getCurrentOrganizationGoals(): Observable<OrganizationGoalsSet> {
        return this.http.get<OrganizationGoalsSet>(environment.apiHost + 'goal/current');
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

    getAllFixedExpenses(period : DateRange, types : string[], employees : number[], creators : number[], page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<FixedExpenses>> {
        const params = this.buildParamsFixedExpenses(period, types, employees, creators, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<FixedExpenses>>(environment.apiHost + 'fixed-expenses/all', { params });
    }

    private buildParamsFixedExpenses(period : DateRange, types : string[], employees : number[], creators : number[], page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection)
          .set('period', JSON.stringify(period));
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
        if (creators.length > 0) {
            creators.forEach(creator => {
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
    
    // FixedExpensesEstimation
    getFixedExpensesEstimationsForBudgetPlanId(budgetPlanId : number): Observable<FixedExpensesEstimation[]> {
        let params = new HttpParams()
          .set('budgetPlanId', budgetPlanId.toString());
        return this.http.get<FixedExpensesEstimation[]>(environment.apiHost + 'fixed-expenses-estimation/get', { params });
    }

    createFixedExpensesEstimation(expense : FixedExpensesEstimation) : Observable<FixedExpensesEstimation> {
        return this.http.post<FixedExpensesEstimation>(environment.apiHost + 'fixed-expenses-estimation/create', expense);
    }

    getAllFixedExpensesEstimations(budgetPlanId : number, period : DateRange, types : string[], employees : number[], page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<FixedExpensesEstimation>> {
        const params = this.buildParamsFixedExpensesEstimation(budgetPlanId, period, types, employees, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<FixedExpensesEstimation>>(environment.apiHost + 'fixed-expenses-estimation/all', { params });
    }

    private buildParamsFixedExpensesEstimation(budgetPlanId : number, period : DateRange, types : string[], employees : number[], page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection)
          .set('budgetPlanId', budgetPlanId.toString())
          .set('period', JSON.stringify(period));
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
    
        return params;
    }

    getFixedExpenseEstimation(id : number): Observable<FixedExpensesEstimation> {
        return this.http.get<FixedExpensesEstimation>(environment.apiHost + 'fixed-expenses-estimation/get/' + id);
    }

    updateFixedExpenseEstimation(expense : FixedExpensesEstimation): Observable<FixedExpensesEstimation> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<FixedExpensesEstimation>(environment.apiHost + 'fixed-expenses-estimation/update', expense, options);
    }

    deleteFixedExpenseEstimation(id: number): Observable<void> {
        return this.http.delete<void>(environment.apiHost + 'fixed-expenses-estimation/delete/' + id);
    }
    
    // Revenue
    createRevenue(revenue : Revenue) : Observable<Revenue> {
        return this.http.post<Revenue>(environment.apiHost + 'revenues/create', revenue);
    }

    getRevenue(id : number): Observable<Revenue> {
        return this.http.get<Revenue>(environment.apiHost + 'revenues/get/' + id);
    }

    getAllRevenues(types : string[], startDate : string, endDate : string, aboveAmount : number, bellowAmount : number, page: number, size : number, sortBy : string, sortDirection : string): Observable<PagedResults<Revenue>> {
        const params = this.buildParamsRevenue(types, startDate, endDate, aboveAmount, bellowAmount, page, size, sortBy, sortDirection);
        return this.http.get<PagedResults<Revenue>>(environment.apiHost + 'revenues/all', { params });
    }
    
    private buildParamsRevenue(types : string[], startDate : string, endDate : string, aboveAmount : number, belowAmount : number, page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection)
          .set('startDate', startDate)
          .set('endDate', endDate)
          .set('aboveAmount', aboveAmount)
          .set('belowAmount', belowAmount);
        if (types && types.length > 0) {
            types.forEach(type => {
              params = params.append('types', type);
            });
        }
        
        return params;
    }

    updateRevenue(revenue : Revenue): Observable<Revenue> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<Revenue>(environment.apiHost + 'revenues/update', revenue, options);
    }

    // TotalProjectRevenue
    private buildParamsTotalProjectRevenue(projectId: number, page : number, size : number, sortBy : string, sortDirection : string): HttpParams {
        let params = new HttpParams()
          .set('projectId', projectId.toString())
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sortBy)
          .set('direction', sortDirection);
          
        return params;
    }

    getAllExternalTotalProjectRevenue(projectId: number, page : number, size : number, sortBy : string, sortDirection : string): Observable<TotalProjectRevenue> {
        const params = this.buildParamsTotalProjectRevenue(projectId, page, size, sortBy, sortDirection);
        return this.http.get<TotalProjectRevenue>(environment.apiHost + 'project-revenues/external', { params });
    }
    getAllInternalTotalProjectRevenue(projectId: number, page : number, size : number, sortBy : string, sortDirection : string): Observable<TotalProjectRevenue> {
        const params = this.buildParamsTotalProjectRevenue(projectId, page, size, sortBy, sortDirection);
        return this.http.get<TotalProjectRevenue>(environment.apiHost + 'project-revenues/internal', { params });
    }
    
    // ProjectBudget
    createProjectBudget(projectBudget: ProjectBudget) : Observable<ProjectBudget> {
        return this.http.post<ProjectBudget>(environment.apiHost + 'project-budget/create', projectBudget);
    }
    
    getProjectBudget(id: number): Observable<ProjectBudget> {
        return this.http.get<ProjectBudget>(environment.apiHost + 'project-budget/get/' + id);
    }
    
    updateProjectBudget(projectBudget: ProjectBudget) : Observable<ProjectBudget> {
        const options = {  headers: new HttpHeaders() };
        return this.http.put<ProjectBudget>(environment.apiHost + 'project-budget/update', projectBudget, options);
    }

    // generatePDFs
    private buildParamsFixedExpensesPDF(filename: string, columns : string[], title: string, text: string = ''): HttpParams {
        let params = new HttpParams()
          .set('filename', filename)
          .set('title', title)
          .set('text', text);
        if (columns && columns.length > 0) {
            columns.forEach(column => {
              params = params.append('columns', column);
            });
        }
        
        return params;
    }
    generateFixedExpensesPDF(filename: string, columns: string[], fixedExpenses: any[], title: string, text: string = ''): Observable<void> {
        const params = this.buildParamsFixedExpensesPDF(filename, columns, title, text);
        return this.http.post(environment.apiHost + 'finance-generate-pdf/fixed-expenses', fixedExpenses, 
        { params: params, responseType: 'blob', observe: 'response' }).pipe(
          map((response: HttpResponse<Blob>) => {
            const contentType = response.headers.get('Content-Type') || 'application/pdf';
            const blob = new Blob([response.body!], { type: contentType });
            saveAs(blob, filename);
            return;
          })
        );
    }

    generateRevenuesPDF(filename: string, columns: string[], revenues: any[], title: string, text: string = ''): Observable<void> {
        const params = this.buildParamsFixedExpensesPDF(filename, columns, title, text);
        return this.http.post(environment.apiHost + 'finance-generate-pdf/revenues', revenues, 
        { params: params, responseType: 'blob', observe: 'response' }).pipe(
          map((response: HttpResponse<Blob>) => {
            const contentType = response.headers.get('Content-Type') || 'application/pdf';
            const blob = new Blob([response.body!], { type: contentType });
            saveAs(blob, filename);
            return;
          })
        );
    }

    //

}