export interface ControlEfficiencyMeasures {
    control_efficiency_measure_title: any;
    id: number;
    risk_control_plan_language_title: string;
    score: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface ControlEfficiencyMeasuresPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: ControlEfficiencyMeasures[];
}

export interface ControlEfficiencyMeasuresSingleLanguage{
    language_id: number;
    title: string;
}
export interface ControlEfficiencyMeasuresLanguage{
    id:number;
    control_efficieny_measures:ControlEfficiencyMeasuresSingleLanguage[]
}

export interface ControlEfficiencyMeasuresSingle {
    id: number;
    score:string,
    is_not_applicable:boolean,
    languages:ControlEfficiencyMeasuresLanguage[];
    
}