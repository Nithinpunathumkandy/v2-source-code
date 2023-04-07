export interface RiskType {
    id: number;
    risk_type_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface RiskTypePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskType[];
}