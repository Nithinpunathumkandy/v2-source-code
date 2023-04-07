export interface RiskRating {
    id: number;
    title: string;
    type: string;
    risk_rating_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface RiskRatingPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskRating[];
}