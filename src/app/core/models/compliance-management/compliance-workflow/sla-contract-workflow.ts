import { CreatedBy } from "../../general/created_by";
import { WorkflowStatus } from "./compliance-workflow";

export interface SlaContractWorkflowDetail{
    sla_and_contract_workflow_item_users: CreatedBy[];
    comment: string;
    created_at: string;
    department: any;
    designation: any;
    division: any;
    id: number;
    level: number;
    organization: any;
    role: any;
    section: any;
    sub_section: any;
    type: string;
    updated_at: string;
    user: CreatedBy;
    user_type: string;
    workflow_status: WorkflowStatus
}

export interface SlaContractWorkflowHistory{
    comment: string;
    created_at: string;
    created_by: any;
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

export interface SlaContractWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SlaContractWorkflowHistory[];
}

export interface SLAWorkflowItem{
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

export interface WorkflowUsers{
    branch_id: number;
    created_at: string;
    created_by: CreatedBy;
    department_id: number;
    designation_id: number;
    division_id: number;
    email: string;
    first_name: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    last_name: string;
    mobile: string;
    organization_id: number;
    personal_email: string;
    pivot: {document_workflow_item_id: number, user_id: number}
    section_id: number;
    status_id: number;
    sub_section_id: number;
    user_id: number;
    user_license_id?: number;
}