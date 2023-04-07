import { StringLiteralLike } from "typescript";
import { CreatedBy } from "../../general/created_by";
import { Department } from "../../general/department";
import { BusinessContinuityPlanStatusDetails, BusinessContinuityPlanStatusLanguage } from "../../masters/bcm/business-continuity-plan-status";
import { Designation } from "../../masters/human-capital/designation";
import { Division } from "../../masters/organization/division";
import { Section } from "../../masters/organization/section";
import { SubSection } from "../../masters/organization/sub-section";
import { Subsidiary } from "../../organization/business_profile/subsidiary/subsidiary";
import { Role } from "../../role.model";

export interface Bcp{
    id: number;
    business_continuity_plan_status_color_code: string;
    business_continuity_plan_status_id: number;
    business_continuity_plan_status_label: string;
    business_continuity_plan_status_title: string;
    business_continuity_plan_status_type: string;
    title: string;
    departments: string;
    description: string;
    divisions: string;
    reference_code: string;
    version: string;
}

export interface BcpDetails{
    id: number;
    title: string;
    created_by: CreatedBy;
    created_at: string;
    departments: Department[];
    divisions: Division[];
    sections: Section[];
    sub_sections: SubSection[];
    organizations: Subsidiary[];
    reference_code: string;
    business_continuity_plan_status: BusinessContinuityPlanStatusDetails;
    versions: BcpVersions[];
    description: string;
    next_review_user_level: number;
    workflow_items: any[];
    submitted_by: CreatedBy;
    // call_tree: CallTree[];
    document_no: string;
    solutions: Solutions[];
    strategys: Strategys[];
}

export interface CallTree{
    children: CallTree []
    created_at: string;
    created_by: CreatedBy
    designation: StringLiteralLike;
    email: string;
    id: number;
    mobile: string;
    name: string;
    user_id: CreatedBy
}

export interface BcpPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:Bcp[];
    from: number;
}

export interface BcpVersions{
    business_continuity_plan_id: number;
    business_continuity_plan_status_id: number;
    contents: BcpContents[];
    call_tree: CallTree[];
    id: number;
    is_latest: number;
    title: string;
}

export interface BcpContents{
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

export interface BcpWorkFlowDetails{
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
    data:BcpWorkflowHistory[];
}

export interface BcpWorkflowHistory{
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

export interface Solutions{
    id: number;
    title: string;
}

export interface Strategys{
    business_continuity_strategy_status_id: number;
    business_continuity_strategy_type_id: number;
    created_at: string;
    created_by: number;
    id: number;
    next_review_user_level: number;
    pivot: {business_continuity_plan_id: number, business_continuity_strategy_id: number}
    reference_code: string;
}