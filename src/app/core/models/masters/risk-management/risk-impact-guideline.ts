export interface RiskImpactGuideline {
    id: number;
    title: string;
    description: string;
    risk_matrix_impact_id: number;
    risk_category_id: number;
    risk_rating_title: string;
    risk_categories_title: string;
    risk_categories: any;
    risk_rating: any;
    status_id: number;
}
export interface RiskImpactGuidelinePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: RiskImpactGuideline[];
}