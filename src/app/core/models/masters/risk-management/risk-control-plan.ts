import { Languages } from "../../risk-management/risk-configuration/impact";

export interface RiskControlPlan {
    is_treatment: number;
    type: string;
    id: number;
    risk_control_plan_language_title: string;
    risk_control_plan_language_description: string;
    status: string;
    status_id :number;
    status_label: string;
    language:Languages;
}

export interface RiskControlPlanPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskControlPlan[];
}

export interface RiskControlPlanSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}
export interface RiskControlPlanLanguage{
    id:number;
    riskcategory:RiskControlPlanSingleLanguage[]
}

export interface RiskControlPlanSingle {
    is_treatment: any;
    id: number;
    languages: RiskControlPlanLanguage[];
    
}