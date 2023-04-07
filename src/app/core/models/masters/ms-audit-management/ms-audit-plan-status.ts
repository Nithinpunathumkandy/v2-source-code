export interface MsAditPlanStatuses {
    id: number;
    ms_audit_plan_status_language_title: string;
    label:string;
    color_code:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface MsAditPlanStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAditPlanStatuses[];
}