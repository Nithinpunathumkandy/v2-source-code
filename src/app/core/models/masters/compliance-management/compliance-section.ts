export interface ComplianceSection {
    id: number;
    title: string;
    status: string;
    status_id: number;
    is_important: boolean;
    status_label: string;
    description: string;
}

export interface ComplianceSectionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceSection[];
}