import { CreatedBy } from "../../general/created_by";
export interface EventChangeRequestResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventChangeRequest[];
}

export interface EventChangeRequest {
    color_code: string;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    description: string;
    event_change_request_reference_code: string;
    event_change_request_status_id: number;
    event_change_request_status_language_title: string;
    event_id: number;
    event_title: string;
    id: number;
    label: string;
    reference_code: string;
    reference_no: number;
    title: string;
    type: string;
    version_no: number;
}

export interface EventChangeRequestDetails {
    change_request_items
    created_at,
    created_by: CreatedBy;
    reference_code,
    title:string;
    reason:string;
    event
    event_budget:event_budget[],
    event_change_request_status:eventCRStatus,
    event_date: event_date,
    event_scope,
    event_change_request_deliverable:any,
    event_status:any,
    id,
    version_no
    next_review_user_level: number;
    submitted_by: CreatedBy;
    workflow_items: ChangeRequestWorkflowItems[]
}

export interface ChangeRequestWorkflowItems{
    comment: string;
    created_at: string;
    created_by: number;
    department_id: number;
    designation_id: number;
    division_id: number;
    event_change_request_id: number;
    id: number;
    level: number;
    organization_id: number;
    role_id: number;
    section_id: number;
    sub_section_id: number;
    type: string;
    updated_at: string;
    user_id: number;
    user_type_id: number
    users: any[];
    workflow_status_id: number;
}

export interface event_budget{
    documents
    event_change_request_id
    existing_amount
    id
    is_deleted
    justification
    new_amount
    type
    year
}

export interface event_date{
    created_at
    created_by
    documents
    event_change_request_id
    existing_end_date
    existing_start_date
    id
    justification
    new_end_date
    new_start_date
    updated_at
    updated_by
}

export interface eventCRStatus{
    id,
    label,
    type,
    language:[{
        id,
        pivot:{
            title
        }
    }]
}
