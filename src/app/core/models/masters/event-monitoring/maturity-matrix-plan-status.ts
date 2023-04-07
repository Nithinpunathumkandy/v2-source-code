export interface MaturityMatrixPlanStatus{
    id:number;
    event_maturity_matrix_plan_status_language_title:string;
    status:string;
    status_id:string;
    status_label:string;
}

export interface MaturityMatrixPlanStatusPaginationResponse {
    current_page:number;
    total:number;
    per_page:number;
    laste_page:number;
    from:number;
    data:MaturityMatrixPlanStatus[];
}

