import { UpdatedBy } from "../../human-capital/users/user-report";
import { Status } from "../change-request/changreRequestContent";
import { CreatedBy } from "../work-flow/workFlow";
import { Language, User } from "./documentDetails";
import { Image } from "./documents";

// export interface DocumentWorkflow{
//     next_review_level: number;
//     next_review_user: ReviewUser;
//     workflow:Workflow[]
// }
export interface DocumentWorkflow{
    comment: string;
    department: CommonInterface
    designation: CommonInterface
    division: CommonInterface
    document_workflow_item_users: WorkFlowUser[];
    id: number;
    level: number;
    organization: CommonInterface
    sub_section: CommonInterface
    type: string;
    user: WorkFlowUser
    workflow_status:string
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

// export interface WorkFlowUser{
//     department: string;
//     designation: string;
//     email: string;
//     first_name: string;
//     id: number;
//     image: Image;
//     last_name: string;
//     mobile: number;
//     status:Status;
// }

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