export interface IsmsRisk {
    per_page: number;
    prev_page_url: string;
    total: number;
    data: Risks[];
}


export interface Risks{
    color_code: string;
    description: string;
    id: number;
    is_inherent: number;
    is_residual: number;
    label: string
    reference_code: string;
    risk_rating: string;
    risk_score: number;
    title: string;
}
export interface IsmsRiskCount{
    close: number;
    close_percentage: number;
    open: number;
    open_percentage: number;
    total_risk: number;
}
export interface IsmsInherentRating{
    count: number;
    id: number;
    color: string;
    isms_risk_ratings: string;
    label: string;
}

export interface IsmsResidualRiskRating{
    count: number;
    id: number;
    color: string;
    isms_risk_ratings: string;
    label: string;
}

export interface IsmsRiskSource{
    count: number;
    id: number;
    color: string;
    risk_sources: string;
}

export interface IsmsRiskDepartments{
    code: string;
    color: string;
    count: number;
    department: string;
    id: number;
}

export interface IsmsRiskSections{
    code: string;
    color: string;
    count: number;
    section: string;
    id: number;
}

export interface IsmsRiskStatuses{
    id: number;
    color: string;
    count: number;
    risk_statuses: string;
}

export interface IsmsRiskCategories{
    id: number;
    color: string;
    count: number;
    risk_category: string;
}


export interface IsmsRiskOwners{
    color: string;
    impact_likelihood_score: number;
    option_value_id: number;
    risk_count: number;
    total_score: number;
}

export interface IsmsRiskHeatMap {
    id: number;
    issue_id: number;
    issue_status_id: number;
    issue_status_title: string;
    issues_title: string;
    title: string;
    length;
}

export interface IsmsRiskAssetCriticality {
    id: number;
    asset_criticality_rating: string;
    color_code: string;
    count: number;
    label: string;
}

export interface IsmsRiskTreatmentProgressCount {
    id: number;
    count: number;
    label: string;
    status: string;
}

export interface IsmsRiskAgeningStatusCount {
    color: string;
    count: number;
    from_date: string;
    id: number;
    light_color: string;
    risk_statuses: string;
    status_id: string;
    to_date: string;
}



