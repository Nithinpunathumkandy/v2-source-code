export interface ComplianceReportingStatus {
    id: number;
    type: string;
    label: string;
    status_label: string;
    language_id: number;
    compliance_reporting_status_language:string
    status: string;
    status_id: number;
    created_by_status: string
}

export interface ComplianceReportingStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceReportingStatus[];
}
