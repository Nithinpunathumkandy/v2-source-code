export interface IsmsRiskMatrixRatingLevel{
    id:number;
    title:string;
    isms_risk_matrix_rating_level_language_title:string;
    is_selected:number;
    description: string;
    status_id :number;
}
export interface IsmsRiskMatrixRatingLevelPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IsmsRiskMatrixRatingLevel[];
}