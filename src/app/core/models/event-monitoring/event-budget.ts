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
    comments;
    actual_amount;
}