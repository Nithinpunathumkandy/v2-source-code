export interface ComplianceFrequency {
    id: number;
    compliance_frequency_language_title: string;
    type: string;
    status: string;
    status_id: number;
    status_label: string;
    description: string;
}

export interface ComplianceFrequencyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceFrequency[];
}