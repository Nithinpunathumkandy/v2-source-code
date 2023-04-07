import { CreatedBy } from "../../human-capital/users/user-kpi";
import { Languages } from "../../masters/general/label";
import { RiskRating } from "../../masters/risk-management/risk-rating";
import { Impact } from "../risk-configuration/impact";
import { Likelihood } from "../risk-configuration/likelihood";
import { RiskAnalysis } from "./risk-assessment";

export interface ResidualRisk{
  risk_controls: any;
  
//   risk_analysis:RiskAnalysis;
  risk_residual_analysis:ResidualAnalysis;
  risk_processes:RiskProcess[];
}

export interface Chart{
    control_efficiency: any;
    risk_analysis_vs_residual: RiskRatingComparison;
    mitigation_cycle_time: number;
}

export interface RiskRatingComparison{
    risk_analysis:any;
    residual_analysis:any;
    
}

export interface ResidualAnalysis{
    likelihood_justification: string;
    impact_justification: string;
    calculation_method:CalculationMethod;
    created_by:CreatedBy;
    impact:Impact;
    likelihood:Likelihood;
    process_details:ProcessDetails[];
    risk_rating:RiskRating;
    risk_score:number;
    total_control_efficiency_score:number;
}
export interface CalculationMethod{
    is_addition:Number;
    is_multiplication:Number;
    is_division:Number;
    is_substraction:Number;
}

export interface RiskProcess{
    process: Process;
    controls:Controls[];
    control_efficiency_measure:ControlEfficiencyMeasure;
    old_control_efficiency:any;
    updated_control_efficiency:any;
    control:any
}

export interface ProcessDetails{
    id:number;
    controls:ControlDetails[]
    title:string;
    reference_code:string;
    pivot:Pivot;
}

export interface Pivot{
    old_control_efficiency_score:number;
    updated_control_efficiency_score:number;
    process_id:number;
}

export interface Controls{
    control:Control
    efficiency:any;
    
}

export interface ControlDetails{
    title:string;
    description:string;
    id:number;

}

export interface Control{
    control_id: any;
    control:Control;
    id:number;
    title:string;
    description:string
}

export interface ControlEfficiencyMeasure{
    id: number;
    language:Languages[];
    score:number;
}

export interface Process{
    process_id: any;
    id:number;
    reference_code:string;
    title:string;
}