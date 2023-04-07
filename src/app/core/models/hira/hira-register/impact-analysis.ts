export interface ImpactAnalysis{
    data:ImpactData[];
    money_total:number;
    total_time:number;
    total_count:number;
    average_performance: number;
}

export interface ImpactAnalysisPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ImpactAnalysis[];
}

export interface ImpactData{
    id:number;
    money:string;
    count:number;
    performance: number;
    time:string;
    risk_impact: any;
    risk_impact_analysis_category_id:number;
    risk_impact_analysis_category_title:string;
}