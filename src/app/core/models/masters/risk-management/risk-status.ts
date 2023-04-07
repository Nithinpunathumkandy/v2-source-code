export interface RiskStatus {
    id: number;
    risk_status_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface RiskStatusPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskStatus[];
}