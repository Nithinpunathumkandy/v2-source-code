import { Languages } from "../../masters/general/label";
import { RiskRating } from "../../masters/risk-management/risk-rating";
import { Impact } from "../risk-configuration/impact";
import { Likelihood } from "../risk-configuration/likelihood";
import { ProcessDetails } from "./residual-risk";

export interface RiskAssessment{
  risk_controls: Control[];
  risk_analysis:RiskAnalysis;
  risk_processes:RiskProcess[];
  //incidents: incidents[];
}

export interface RiskAnalysis{
    likelihood_justification: string;
    impact_justification: string;
    process_details:ProcessDetails[];
    risk_score:number;
    likelihood:Likelihood;
    impact:Impact;
    total_control_efficiency_score:number;
    risk_rating:RiskRating;
}

export interface RiskProcess{
    process: Process;
    controls:Controls[];
    control_efficiency_measure:ControlEfficiencyMeasure;
}

export interface Controls{
    control:Control
    efficiency:ControlEfficiencyMeasure
}

export interface Control{
    pivot: any;
    old_control_efficiency_measure_id: any;
    old_control_efficiency_measure_score: number;
    id:number;
    title:string;
    description:string;
    efficiency:ControlEfficiencyMeasure;
}

export interface ControlEfficiencyMeasure{
    id: number;
    language:Languages[];
    score:number;
}

export interface Process{
    id:number;
    reference_code:string;
    title:string;
}
export interface incidents{
    id: number;
    title: string;
    description:string;
    reference_code: string;
}