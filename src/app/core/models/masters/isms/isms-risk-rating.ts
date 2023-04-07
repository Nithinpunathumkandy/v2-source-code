export interface IsmsRiskRating {
    title: any;
    label: any;
    score_to: any;
    score_from: any;
    risk_rating_values: any;
    id: number;
    isms_risk_rating_language_title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface IsmsRiskRatingPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: IsmsRiskRating[];
}