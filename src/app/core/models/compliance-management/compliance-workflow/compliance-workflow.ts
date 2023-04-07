import { Image } from "../../image.model";
import { Department } from "../../masters/organization/department";
import { Division } from "../../masters/organization/division";
import { Section } from "../../masters/organization/section";
import { SubSection } from "../../masters/organization/sub-section";
import { StatusDetails } from "../../status-details";
import { WorkflowUsers } from "./sla-contract-workflow";

export interface ModuleGroupsResponse {
    data:ComplianceManagementModules[]
}

export interface ComplianceManagementModules {
    module_id: number;
    module: string;
}

export interface ComplianceWorkflow {
    id: number;
    title: string;
    description: string;
    created_by_status: string;
    created_by_image_token: string;
    created_by_first_name :string;
    module_id: number;
    module_title:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ComplianceWorkflowPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceWorkflow[];
}

export interface ComplianceWorkflowDetails {
    created_at: string;
    created_by: CreatedBy;
    departments: Department[];
    description: string;
    view_more?: boolean;
    divisions: Division[];
    id: number;
    module: WorkflowModule;
    organizations: any[]
    sections: Section[]
    status: StatusDetails
    sub_sections: SubSection[]
    title: string;
    workflow_items: WorkflowDetailsWorkflowItems[]
}

export interface WorkflowModule{
    client_side_url: string;
    created_at: string;
    created_by: number;
    id: number;
    is_menu: number;
    is_workflow: number;
    module_group_id: number;
    module_id: number;
    order: number;
    original_module_group_id: number;
    status_id: number;
    title: string;
}

export interface WorkflowDetailsWorkflowItems{
    department: any;
    designation: any;
    division: any;
    id: number;
    level: number;
    organization: any;
    role: any;
    section: any;
    sub_section: any;
    team: any[]
    type: string;
    user: CreatedBy;
    user_type: string;
}

export interface CreatedBy {
    department: string;
    designation: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    mobile: string;
    image: Image;
    status: Status;
}

export interface Status {
    id: number;
}

export interface WorkflowItems {
    comment: string;
    created_at: string;
    department_id: number;
    designation_id: number;
    division_id: number;
    document_id: number;
    id: number;
    level: number;
    organization_id: number;
    role_id: number;
    section_id: number;
    sub_section_id: number;
    type: string;
    user_id: number;
    user_type_id: number;
    users: WorkflowUsers[]
    workflow_status_id: number;
}

export interface Users {
    created_at:string
    id:number
    image_url:number
    image_title:string;
    image_token:string;
    first_name:string;
    last_name:string;
    level_id:number;
    level:number;
}

export interface Team {
    created_at:string
    id:number
    image_url:number
    image_title:string;
    image_token:string;
    level_id:number;
    level:number;
}

export interface WorkflowStatus{
    created_at: string;
    created_by: any;
    id: number;
    language: WorkflowStatusLanguage[]
    status_id: number;
    type: string;
}

export interface WorkflowStatusLanguage{
    code: string;
    created_at: string;
    created_by: any;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {workflow_status_id: number, language_id: number, title: string}
    status_id: number;
    title: string;
    type: string;
}