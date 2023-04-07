export interface AuditTestPlanStatus{
    id : number,
    title :string,
    status_id : number,
    status_label : string,
    status : string,
}
export interface AuditTestPlanStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditTestPlanStatus[];
}
export interface AuditTestPlanStatusSingle{
    id: number;
    languages: AuditTestPlanStatusSingleLanguage[];
}
export interface AuditTestPlanStatusSingleLanguage{
    language_id: number;
    title: string;
    pivot:{
        am_audit_test_plan_status_id: number,
        language_id: number,
        title: string
    }
}
