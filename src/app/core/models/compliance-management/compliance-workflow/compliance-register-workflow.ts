import { CreatedBy, WorkflowStatus } from "./compliance-workflow";

export interface ComplianceRegisterWorkflowDetail{
    comment: string;
    compliance_workflow_item_users: CreatedBy[];
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

export interface ComplianceRegisterWorkflowHistory{
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

export interface ComplianceRegisterWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceRegisterWorkflowHistory[];
}