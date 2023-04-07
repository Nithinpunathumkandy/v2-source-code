export interface IsmsRiskImpactGuideline {
    id: number;
    description: string;
    risk_category_id: number;
    risk_categories_title: string;
    isms_risk_matrix_impact_id: number;
    isms_risk_matrix_impact_title: string;
    status_id: number;
    isms_risk_matrix_impact;
    risk_categories ;
}
export interface IsmsRiskImpactGuidelinePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IsmsRiskImpactGuideline[];
}