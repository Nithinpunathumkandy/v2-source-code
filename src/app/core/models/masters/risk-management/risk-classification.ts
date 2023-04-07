export interface RiskClassification {
    id: number;
    risk_classification_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
    is_risk:number
}

export interface RiskClassificationPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskClassification[];
}