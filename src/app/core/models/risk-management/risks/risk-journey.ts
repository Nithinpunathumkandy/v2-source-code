import { Processes } from '../../bpm/process/processes';
import { CreatedBy } from '../../general/created_by';
import { Status } from '../../general/status';
import { Users } from '../../human-capital/users/users';
import { Department } from '../../masters/organization/department';
import { Division } from '../../masters/organization/division';
import { IssueDomain } from '../../masters/organization/issue-domain';
import { Section } from '../../masters/organization/section';
import { SubSection } from '../../masters/organization/sub-section';
import { RiskArea } from '../../masters/risk-management/risk-area';
import { RiskCategory } from '../../masters/risk-management/risk-category';
import { RiskClassification } from '../../masters/risk-management/risk-classification';
import { RiskControlPlan } from '../../masters/risk-management/risk-control-plan';
import { RiskLibrary } from '../../masters/risk-management/risk-library';
import { RiskReviwFrequency } from '../../masters/risk-management/risk-review-frequency';
import { RiskSource } from '../../masters/risk-management/risk-source';
import { RiskType } from '../../masters/risk-management/risk-type';
import { MsType } from '../../organization/business_profile/ms-type/ms-type';
import { Subsidiary } from '../../organization/business_profile/subsidiary/subsidiary';
import { Issue } from '../../organization/context/issue-list';
import { Impact, Languages } from '../risk-configuration/impact';
import { Likelihood } from '../risk-configuration/likelihood';
import { RootCauseCategory, RootCauseCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-categories';
import { RootCauseSubCategory, RootCauseSubCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-sub-categories';

export interface RiskJourney {
    journey_workflow_items: any;
    journey_submitted_by: any;
    journey_next_review_user_level: number;
    next_review_user_level: number;
    strategic_objectives: any;
    controls: any;
    customers: any;
    products: any;
    risk_location: any;
    projects: any;
    locations: any;

    id: number;
    title: string;
    description: string;
    created_at: string;
    created_by: CreatedBy;
    departments: Department[];
    divisions: Division[];
    issueDomains: IssueDomain[];
    organization_issues: any;
    ms_type_organizations: MsType[];
    next_review_date: string;
    organizations: Subsidiary[];
    processes: Processes[];
    reference_code: string;
    responsible_users: Users[];
    risk_areas: RiskArea[];
    risk_category: RiskCategory;
    risk_sub_category:any;
    risk_classification: RiskClassification;
    risk_control_plan: RiskControlPlan;
    risk_date: string;
    risk_review_frequency: any;
    risk_types: RiskType[];
    sections: Section[];
    status: Status;
    sub_sections: SubSection[];
    updated_at: string;
    is_analysis_performed: number;
    is_residual_analysis_performed: number;
    risk_status: Languages[]
    impact: string;
    risk_sources: RiskSource[];
    risk_library: RiskLibrary;
    risk_owner: Users;
    is_corporate: boolean;
    submitted_by:any;
    closed_count:number;
    total_count:number;
    completed_percentage:any;

    risk_residual_analysis: ResidualAnalysis;
    risk_analysis: ResidualAnalysis;
    risk_root_cause_analysis: RootCauseAnalysis;
    //risk_processes:RiskProcess[];

    risk_key_risk_indicators: KRI;
    risk_impact_analysis:ImpactAnalysis;
    risk_impacts: any;
}

export interface ResidualAnalysis {
    likelihood_justification: string;
    impact_justification: string;
    calculation_method: CalculationMethod;
    created_by: CreatedBy;
    risk_matrix_impact: Impact;
    risk_matrix_likelihood: Likelihood;
    //process_details:ProcessDetails[];
    risk_rating: RiskRating;
    risk_score: number;
    total_control_efficiency_score: number;
}

export interface CalculationMethod {
    is_addition: Number;
    is_multiplication: Number;
    is_division: Number;
    is_substraction: Number;
}

export interface RiskRating {
    id: number;
    risk_rating_language_title: string;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    score_from: number;
    score_to: number;
    language_id: number;
    risk_treatment: string;
    language: Languages;
    label: string;
}

// export interface RiskProcess{
//     process: Process;
//     controls:Controls[];
//     control_efficiency_measure:ControlEfficiencyMeasure;
// }

// export interface ProcessDetails{
//     id:number;
//     controls:ControlDetails[]
//     title:string;
//     reference_code:string;
//     pivot:Pivot;
// }

export interface RootCauseAnalysis {
    id: number;
    title: string;
    status: string;
    status_id: number;
    finding_id: number;
    root_cause_category_id: RootCauseCategory;
    description: string;
    root_cause_sub_category_id: RootCauseSubCategory;
    root_cause_category: string;
    root_cause_sub_category: string;
    why: string;

    created_by_image_token: string;
    created_by_first_name: string;
    created_by_last_name: string;
    created_by_designation: string;

}

export interface RiskSummary {
    completed_percentage: number;
    closed_count: number;
    total_count: number;
}

export interface RiskTreatment {
    title: string;
    id: number;
    reference_code: string;
    risk_treatment_status_title: string;
    responsible_user_designation: string;
    responsible_user_first_name: string;
    responsible_user_id: any;
    responsible_user_image_token: string;
    responsible_user_last_name: string;
}

export interface KRI {
    unit_id: any;
    predicted_exposure: any;
    actual_exposure: any;
    risk_category_id: any;
    key_risk_indicator_id: any;
    id: number;
    title: string;
    exposure: number;

}
export interface ImpactAnalysis {
    data: ImpactData[];
    money_total: number;
    total_time: number;
    total_count: number;
}



export interface ImpactData {
    id: number;
    money: string;
    count: number;
    time: string;
    risk_impact_analysis_category_id: number;
    risk_impact_analysis_category_title: string;
}