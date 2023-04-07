export interface RiskCount {
    close: number;
    open: number;
    total_risk: number;
}

export interface RiskCountBySource {
    id: number;
    count: number;
    risk_sources: string;
}

export interface RiskCountByDepartment {
    id: number;
    code: string;
    count: number;
    department: string;
}

export interface RiskCountBySection {
    id: number;
    count: number;
    section: string;
}

export interface RiskCountByStatus {
    id: number;
    count: number;
    risk_statuses: string;
}

export interface RiskCountByCategories {
    id: number;
    count: number;
    risk_category: string;
}

export interface RiskCountByOwners {
    id: number;
    count: number;
    first_name: string;
    last_name: string;
}

export interface RiskHeatMap{
    risk_score:number;
    impact_id:number;
    likelihood_id:number;
    risk_count:number;
    color:string;
}

export interface RiskList{
    id:number;
    is_inherent:number;
    is_residual:number;
    risk_score:number;
    description:string;
    reference_code:string;
    title:string;
}

export interface SecondRiskList{
    id:number;
    is_inherent:number;
    is_residual:number;
    risk_score:number;
    description:string;
    reference_code:string;
    title:string;
}

export interface RiskCountByInherentRiskRatings {
    id: number;
    count: number;
    risk_ratings: any;
}

export interface RiskCountByResidualRiskRatings {
    id: number;
    count: number;
    risk_ratings: any;
}