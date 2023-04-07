export interface MsAditFindingStatuses {
    id: number;
    ms_audit_finding_status_language_title: string;
    label:string;
    color_code:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface MsAditFindingStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAditFindingStatuses[];
}