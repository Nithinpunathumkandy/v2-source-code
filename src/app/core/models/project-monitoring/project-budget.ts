export interface BudgetPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Budgets[];
}

export interface Budgets{
    id;
    year;
    amount;
}

export interface PaymentResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Payments[];
}
export interface Payments{
    id:number;
    year:string;
    project_milestone_title:string,
    q1;
    q2;
    q3;
    q4;
    total;
    payment_total;
    project_milestone_id : number
}
