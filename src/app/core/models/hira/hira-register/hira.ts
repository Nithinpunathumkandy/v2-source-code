import { Processes } from '../../bpm/process/processes';
import { CreatedBy } from '../../general/created_by';
import { Status } from '../../general/status';
import { Branch, Users } from '../../human-capital/users/users';
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
import { Impact, Languages } from '../hira-configuration/impact';
import { Likelihood } from '../hira-configuration/likelihood';

export interface Risk {
    is_selected: any;
    created_by: any;
    id: number;
    title:string;
    is_residual_analysis_performed:number;
    is_corporate:boolean;
    risk_owner:any;
    departments:any;
    divisions:any;
    sections:any;
}

export interface RiskPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: Risk[];
}

export interface IndividualRisk {
	isms_vulnerabilities: any;
	risk_asset_categories: any;
	risk_assets: any;
    workflow_items: any;
    is_registered: any;
    risk_sub_category: any;
    next_review_user_level: any;
    submitted_by: any;
    is_functional: any;
    risk_cause: any;
    risk_observation: any;
    last_review_note: any;
    strategic_objectives: any;
    controls: any;
    customers: any;
    products: any;
    risk_location: any;
    projects: any;
    locations: any;

    id: number;
    title: string;
    description:string;
    created_at: string;
    created_by:CreatedBy;
    departments:Department[];
    divisions:Division[];
    branches: Branch[];
    issueDomains:IssueDomain[];
    organization_issues:Issue[];
    ms_type_organizations:MsType[];
    next_review_date:string;
    organizations:Subsidiary[];
    processes:Processes[];
    reference_code:string;
    responsible_users:Users[];
    risk_areas:RiskArea[];
    risk_category:RiskCategory;
    risk_classification:RiskClassification;
    risk_control_plan:RiskControlPlan;
    risk_date:string;
    risk_review_frequency:RiskReviwFrequency;
    risk_types:RiskType[];
    sections:Section[];
    status:Status;
    sub_sections:SubSection[];
    updated_at:string;
    is_analysis_performed:any;
    is_residual_analysis_performed: any;
    risk_status:RiskStatus;
    impact:string;
    risk_sources:RiskSource[];
    risk_library:RiskLibrary;
    risk_owner:Users;
    is_corporate:boolean;
    risk_treatment_plan:string;
    risk_impacts:bulletArray[];
    risk_causes:bulletArray[];
    asset_criticality_score:any;
    incidents: incidents[];
    
}

export interface RiskStatus{
    Language:Languages[];
    type:string;
    id:number;
}

export interface bulletArray{
    title:string;
}

export interface ContextChart{
    budget_used:Budget;
    control_efficiency:number;
    risk_analysis:Analysis;

}

export interface Budget{
    total_amount_used:any;
    total_budget:string;
    used_percentage:number;

}

export interface Analysis{
    impact_details:Impact;
    likelihood_details:Likelihood;
    risk_rating:RiskRating;
    score:any;
}

export interface RiskRating{
    label:string;
    language:Languages[];
    type: string;
}

export interface incidents{
    id: number;
    title: string;
    description:string;
    reference_code: string;
}