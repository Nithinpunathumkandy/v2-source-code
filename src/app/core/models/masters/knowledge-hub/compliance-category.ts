export interface ComplianceCategory {
    id: number;
    title: string;
    description: string;
    status_label: string;
    status_id :number;
}
export interface ComplianceCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceCategory[];
}