
import { CreatedBy } from "../../bpm/controls/controls";
import { Image } from "../../image.model";
import { User } from "../../user.model";
import { CustomerComplaintDocuments } from "../customer-complaint/customer-complaint";
import { CustomerComplaintsList } from "../customers/customers";
export interface CustomerComplaintActionPlan{
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    customer_complaint_action_plan_status_color_code: string;
    customer_complaint_action_plan_status_id: number;
    customer_complaint_action_plan_status_type: string;
    customer_complaint_action_plan_status_title: string;
    customer_complaint_action_type: string;
    customer_complaint_action_type_id: number;
    customer_complaint_id: number;
    customer_complaints_title: string;
    id: number;
    target_date: Date;
    start_date: Date;
    title: string;
    description: string;
    receiving_date: Date
    reference_code: string;
    responsible_user_designation: string;
    responsible_user_first_name: string;
    responsible_user_id: number;
    responsible_user_image_token: string;
    responsible_user_last_name: string;
}



export interface CustomerComplaintActionPlanPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CustomerComplaintActionPlan[];
}

export interface IndividualCustomerComplaintActionPlan {
    created_at: string;
    created_by: CreatedBy;
    customer_complaint: CustomerComplaintsList
    customer_complaint_action_plan_status: ActionPlanStatus
    customer_complaint_action_type: ActionType;
    customer_complaint_action_plan_update: ComplaintActionPlanUpdates[]
    description: string;
    target_date: string;
    start_date: string;
    customer_complaint_action_plan_watchers: ResponsibleUser[];
    id: number;
    documents: ActionPlanDocuments[]
    reference_code: string;
    responsible_user: ResponsibleUser;
    title: string;
}

export interface ResponsibleUser{
    department: string;
    designation: string;
    email: string;
    first_name: string;
    id: number;
    image: Image
    last_name: string;
    mobile: string;
}

export interface ActionPlanStatus{
    color_code: string;
    created_at: string;
    created_by: number;
    id: number;
    label: string;
    language: ActionPlanStatusLanguage[]
    status_id: number;
    type: string;
}

export interface ActionPlanStatusLanguage{
    code: string;
    created_at: string;
    created_by: number;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {customer_complaint_action_plan_status_id: number, language_id: number, title: string}
    status_id: number;
    title: string;
    type: string;
}

export interface ActionType{
    created_at: string;
    created_by: number;
    id: number;
    language: ActionTypeLanguage[]
    status_id: number;
    type: string;
}

export interface ActionTypeLanguage{
    code: string;
    created_at: string;
    created_by: number;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {customer_complaint_action_type_id: number, language_id: number, title: string}
    status_id: number;
    title: string;
    type: string;
}

export interface ComplaintActionPlanUpdates{
    comment: string;
    created_at: string;
    created_by: CreatedBy;
    customer_complaint_action_plan_id: number;
    customer_complaint_action_plan_status: ActionPlanStatus;
    customer_complaint_action_plan_status_id: number;
    documents: ActionPlanUpdateDocuments[]
    id: number;
    percentage: number;
}

export interface ActionPlanUpdateDocuments{
    created_at: string;
    created_by: number;
    customer_complaint_action_plan_update_id: number;
    document_id: null
    ext: string;
    id: number;
    kh_document: any;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    url: string;
}

export interface ActionPlanDocuments{
    created_at: string;
    created_by: number;
    customer_complaint_action_plan_id: number;
    document_id: null
    ext: string;
    id: number;
    kh_document: any;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    url: string;
}

