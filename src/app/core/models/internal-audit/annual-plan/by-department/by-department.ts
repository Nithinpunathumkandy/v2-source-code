export  interface ByDepartment{
    id:number;
    audit_plans: number;
    department:string;
    department_id:number;
}

export interface ByDepartmentPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data:ByDepartment[]
}