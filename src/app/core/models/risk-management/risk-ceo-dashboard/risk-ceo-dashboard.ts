export interface CeoRiskCount {
    close: number;
    close_percentage:number;
    open: number;
    open_percentage:number;
    total_risk: number;
}

export interface CeoRiskCountBySource {
    id: number;
    count: number;
    risk_sources: string;
    color:string;
}

export interface CeoRiskDetailsByDepartment {
    id: number;
    title:string;
    extreme:number;
    very_high:number;
    high:number;
    medium:number;
    low:number;
    grand_total:number;
    code:string;
}

export interface CeoCountByDepartment {
    id: number;
    count: number;
    department: string;
}

export interface CeoRiskCountBySection {
    id: number;
    count: number;
    section: string;
}

export interface CeoRiskCountByStatus {
    id: number;
    count: number;
    risk_statuses: string;
}

export interface CeoRiskCountByCategories {
    id: number;
    count: number;
    risk_category: string;
}

export interface CeoRiskCountByDivisions {
    id: number;
    count: number;
    division: string;
}

export interface CeoRiskCountByOwners {
    id: number;
    count: number;
    first_name: string;
    last_name: string;
}

export interface CeoRiskHeatMap{
    risk_score:number;
    impact_id:number;
    likelihood_id:number;
    risk_count:number;
    color:string;
}

export interface CeoRiskList{
    id:number;
    is_inherent:number;
    is_residual:number;
    risk_score:number;
    description:string;
    reference_code:string;
    title:string;
}

export interface CeoSecondRiskList{
    id:number;
    is_inherent:number;
    is_residual:number;
    risk_score:number;
    description:string;
    reference_code:string;
    title:string;
}

export interface CeoRiskCountByInherentRiskRatings {
    id: number;
    count: number;
    risk_ratings: any;
}

export interface CeoRiskCountByResidualRiskRatings {
    id: number;
    count: number;
    risk_ratings: any;
}

export interface CeoDivisions {
    id:number;
    extreme_risk:number;
    title:string;
}

export interface RiskHeatMap{
    department_id: string;
    section_id:number;
    divsion_id:number;
    risk_source_id:number;
    risk_category_id: string;
    risk_score: any;
    id:number;
    title:string;
}

export interface RiskScore {
    color:string;
    count:number;
    score:number;
}