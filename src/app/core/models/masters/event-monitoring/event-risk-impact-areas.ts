export interface RiskImpactArea {
    id: number;
    risk_impact_area_title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface RiskImpactAreaPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskImpactArea[];
}

export interface RiskImpactAreaSingle {
    id: number;
    languages: RiskImpactAreaLanguage[];
    
}

export interface RiskImpactAreaLanguage{
    id:number;
    event_type:RiskImpactAreaSingleLanguage[]
}

export interface RiskImpactAreaSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}