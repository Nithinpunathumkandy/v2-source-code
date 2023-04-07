export interface MSAuditFindingCAStatuses {
    id: number;
    title: string;
    ms_audit_finding_corrective_action_status_language_title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface MSAuditFindingCAStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MSAuditFindingCAStatuses[];
}