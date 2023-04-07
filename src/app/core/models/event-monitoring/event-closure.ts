import { UpdatedBy } from "../human-capital/users/user-report";
import { Language, User } from "../knowledge-hub/documents/documentDetails";
import { CreatedBy } from "../knowledge-hub/work-flow/workFlow";
import { Image } from "../knowledge-hub/documents/documents";
export interface EventClosurePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventClosure[];
}

export interface EventClosure{
    actual_event_completion: string;
    event_closure_status_color_code : string;
    event_closure_status_label : string
    event_title : string
    planned_event_completion : string;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    event_closure_status_title: string;
    id: number;
    updated_at: string;
    updated_by: number;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: string;
    updated_by_last_name: string;
    updated_by_status: string;
   
}

export interface indivitualEventClosure{
    id:number;
    actual_event_completion_date: string;
    scope_of_works:string;
    event_summary:string;
    title: string;
    event_reference_code;
    event_closure_status_title
    // checklist: [{
    //     comment: string;
    //     created_at: string;
    //     created_by: number;
    //     documents:  Documents[]
    //     event_closure_checklist: { 
    //         id: number; 
    //         created_at: string;
    //         updated_at: string;
    //     }
    //     event_closure_checklist_id: number;
    //     event_closure_checklist_status: string;
    //     event_closure_id: number;
    //     id: number;
    // }]
    comments: string
    event: any
    event_closure_status:any
    checklist: any
    documents: Documents    
    submitted_by:any
    next_review_user_level:number
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at: string;
    created_by: number;
    thumbnail_url: string;
    updated_at: string;
    updated_by: string;
    user_job_id: string;
}

// export interface DocumentWorkflow{
//     next_review_level: number;
//     next_review_user: ReviewUser;
//     workflow:Workflow[]
// }
export interface EventClosureWorkflow{
    comment: string;
    department: CommonInterface
    designation: CommonInterface
    division: CommonInterface    
    id: number;
    level: number;
    organization: CommonInterface
    sub_section: CommonInterface
    type: string;
    user: WorkFlowUser
    workflow_item_users: WorkFlowUser[];
    workflow_status:string
}

export interface CRWorkflowHistoryPagination {

    current_page:number;
    total:number;
    per_page: number;
    from: number;
    data:WorkflowHistory[];

}

export interface WorkflowHistory{

    comment: string;
    created_at:  string;
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
    reviewed_user_email: string;
    reviewed_user_mobile: string;
    reviewed_user_department: string;
    workflow_status_id: number;
    workflow_status_title: string;
}

export interface WorkFlowUser{
    
    department: string;
    designation: string;
    email: string;
    first_name: string;
    id: number;
    image: Image;
    last_name: string;
    mobile: number;
    status:Status;

}

export interface CommonInterface{
    
        id: number;
        title:string;
    
}

export interface ReviewUser{
    department: string;
    designation: string;
    email: string;
    first_name: string;
    id: number;
    image: Image;
    last_name: string;
    mobile: number;
    status:Status
}
export interface Workflow{
    comment: string;
    created_at: string;
    created_by: CreatedBy;
    document_status: WorkflowDocumentStatus;
    id: number;
    level: number;
    updated_at: string;
    updated_by: UpdatedBy;
    user:User
}

export interface WorkflowDocumentStatus{
    created_at: string;
    created_by: number;
    id: number;
    status_id: number;
    type: string;
    updated_at: string;
    updated_by: number;
    language: Language[];
}

export interface Status{
    id: number;
    title: string;
    label: string;
}

export interface WorkflowHistoryPagination {
    current_page:number;
    total:number;
    per_page: number;
    from: number;
    data:WorkflowHistory[];
}

export interface WorkflowHistory{
    comment: string;
    created_at:  string;
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
    reviewed_user_email: string;
    reviewed_user_mobile: string;
    reviewed_user_department: string;
    workflow_status_id: number;
    workflow_status_title: string;
}