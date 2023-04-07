import { CreatedBy } from "../../general/created_by";
import { Department } from "../../general/department";
import { BusinessContinuityPlanStatusDetails, BusinessContinuityPlanStatusLanguage } from "../../masters/bcm/business-continuity-plan-status";
import { Designation } from "../../masters/human-capital/designation";
import { Division } from "../../masters/organization/division";
import { Section } from "../../masters/organization/section";
import { SubSection } from "../../masters/organization/sub-section";
import { Subsidiary } from "../../organization/business_profile/subsidiary/subsidiary";
import { Role } from "../../role.model";
import { Organization } from '../../organization.model';
import { Processes, ProcessResponsibleUsers } from "../../bpm/process/processes";
import { Subsection } from "../../human-capital/users/users";

export interface BcmRiskAnalysis{
    risk_analysis:{
        comments
    impact
    likelihood
    impact_justification
    likelihood_justification
    process_details
    risk_score
    risk_areas
    risk_rating:{
        id
        type
        label
        color_code
        language: [
            {
                pivot: {
                    risk_rating_id
                    title
                }
            }
        ]
    }
    risk_impact_category_analyses:risk_impact_category_analyses[]
    }
}

export interface BcmRiskResidualAnalysis{
    risk_residual_analysis:{
        comments
    impact
    likelihood
    process_details
    risk_score
    risk_rating:{
        id
        type
        label
        color_code
        language: [
            {
                pivot: {
                    risk_rating_id
                    title
                }
            }
        ]
    }
    risk_impact_category_analyses:risk_impact_category_analyses[]
    }
}

export interface risk_impact_category_analyses{
    bia_impact_category_id
    id
    is_inherent
    is_residual
    risk_id
    risk_matrix_impact_id
    risk_matrix_likelihood_id
    risk_rating_id
    risk_score
    risk_matrix_impact:{
        id
        language:{
            description
            title
        }
    }
    risk_matrix_likelihood:{
        id
        language:{
            description
            title
        }
    }
    risk_matrix_calculation_method_id
    risk_matrix_calculation_method:{
        id
        is_addition
        is_division
        is_multiplication
        is_selected
        is_subtraction
        language:[{
            description
            title
        }]
    }
}

export interface BcmRiskAssessment{
    bia_tire: string
    bia_tire_id: number
    business_impact_analysis_id:number
    departments: string
    designation_id: number
    divisions: string
    id: number
    inherent_risk_rating_id: number
    inherent_risk_rating_title: string
    inherent_risk_score: number
    label: string
    processes: string
    reference_code: string
    residual_risk_rating_id: number
    residual_risk_rating_title: string
    residual_risk_score: number
    risk_owner_designation: string
    risk_owner_first_name: string
    risk_owner_id: number
    risk_owner_image_token: string
    risk_owner_last_name: string
    risk_status_id: number
    risk_status_title: string
    title: string
}

export interface BcmRiskAssessmentDetails{
    created_at
    created_by:CreatedBy;
    customers:any
    departments: Department[]
    description: string
    divisions: Division[]
    id: number
    is_analysis_performed: any
    is_corporate: any
    is_functional: any
    is_registered: any
    is_residual_analysis_performed: any
    next_review_date: string
    organization_issues: any
    organizations: Organization
    processes:any
    controls
    reference_code: string
    responsible_users: ProcessResponsibleUsers[]
    risk_date: string
    risk_focus_areas: any
    risk_assets:any
    risk_owner: ProcessResponsibleUsers
    risk_control_plan
    risk_treatment_plan
    risk_review_frequency: {
        id:number
        type:string
        language:[
            {
                pivot:{
                    title:string
                }
            }
        ]
    }
    risk_status: {
        color_code:string
        id:number
        type:string
        language:[
            {
                pivot:{
                    title:string
                }
            }
        ]
    }
    risk_types: RiskTypes[]
    sections: Section[]
    services: []
    strategic_objectives: any
    sub_risks: SubRisk[]
    sub_sections: Subsection[]
    title: string
}

export interface Mapping{
    id:number
    title:string
}

export interface SubRisk{
    id:number
    title:string
}

export interface RiskTypes{
    id:number
    type:string
    language:[
        {
            pivot:{
                title:string
            }
        }
    ]
}

export interface BcmRiskAssessmentPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:BcmRiskAssessment[];
}

export interface BcmRiskAssessmentVersions{
    business_continuity_plan_id: number;
    business_continuity_plan_status_id: number;
    contents: BcmRiskAssessmentContents[];
    id: number;
    is_latest: number;
    title: string;
}

export interface BcmRiskAssessmentContents{
    business_continuity_plan_version_content_id: number;
    business_continuity_plan_version_id: number;
    children: []
    created_at: string;
    description: string;
    id: number;
    order: number;
    status_id: number;
    title: string;
}

export interface BcmRiskAssessmentWorkFlowDetails{
    business_continuity_plan_workflow_item_users: CreatedBy[]
    comment: string;
    department: Department
    designation: Designation
    division: Division
    id: number;
    level: number;
    organization: Subsidiary
    role: Role
    section: Section
    sub_section: SubSection;
    type: string;
    user: CreatedBy
    user_type: string;
    workflow_status: WorkflowStatus;
}

export interface WorkflowStatus{
    id: number;
    language: BusinessContinuityPlanStatusLanguage[];
    status_id: number;
    type: string;
}

export interface WorkFlowHistoryPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:BcmRiskAssessmentWorkflowHistory[];
}

export interface BcmRiskAssessmentWorkflowHistory{
    comment: string;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    id: number;
    level: number;
    reviewed_user_designation: string;
    reviewed_user_designation_id: number;
    reviewed_user_first_name: string;
    reviewed_user_image_token: string;
    reviewed_user_last_name: string;
    workflow_status_id: number;
    workflow_status_title: string;
}