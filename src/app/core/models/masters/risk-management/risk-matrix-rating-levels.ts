export interface RiskMatrixRatingLevels {
    is_selected: boolean;
    is_five: boolean;
    id: number;
    risk_matrix_rating_level_language_title: string;
    status: string;
    status_id :number;
    is_three:boolean;
    is_four:boolean;
    status_label: string;
}

export interface RiskMatrixRatingLevelsPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskMatrixRatingLevels[];
}