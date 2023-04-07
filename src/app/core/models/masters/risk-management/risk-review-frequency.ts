export interface RiskReviwFrequency {
    id: number;
    risk_review_frequency_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface RiskReviewFrequencyPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskReviwFrequency[];
}