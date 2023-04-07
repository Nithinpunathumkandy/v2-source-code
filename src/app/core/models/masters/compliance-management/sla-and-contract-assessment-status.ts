export interface SlaAndContractAssessmentStatus {
    id: number;
    type: string;
    label: string;
    status_label: string;
    language_id: number;
    title:string;
    status: string;
    status_id: number;
    created_by_status: string
}

export interface SlaAndContractAssessmentStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SlaAndContractAssessmentStatus[];
}
