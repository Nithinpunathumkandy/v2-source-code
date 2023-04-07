export interface ComplianceArea {
    id: number;
    title: string;
    status: string;
    status_id: number;
    is_important: boolean;
    status_label: string;
    description: string;
}

export interface ComplianceAreaPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceArea[];
}