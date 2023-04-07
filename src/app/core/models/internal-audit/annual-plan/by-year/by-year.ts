export  interface ByYear{
    id:number;
    audit_plans: number;
    year:any;
}

export interface ByYearPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data:ByYear[]
}