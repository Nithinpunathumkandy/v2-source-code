// import { CreatedBy } from '../human-capital/users/user-document';
// import { Status } from '../status.model';

import { CreatedBy } from "../../bpm/process/activity";
import { ResponsibleUser } from "../../customer-satisfaction/customer-complaint-action-plans/customer-complaint-action-plans";
import { Language } from "../../internal-audit/audit-program/audit-program";


export interface ActionPlans{
    id:number;
    title:string;
    start_date: string;
    target_date: string;
    business_assessment_title:string;
    business_assessment_action_plan_status_label:string;
    business_assessment_action_plan_status_language_title:string;

}

export interface BAActionPlanStatus{

    id:number;
    type:string;
    label:string;
    language:Language;
    created_by:CreatedBy
}

export interface BAActionPlanDetails{

    id:number;
    title:string;
    responsible_users:ResponsibleUser[];
    start_date: string;
    target_date: string;
    business_assessment_action_plan_status:BAActionPlanStatus;
    business_assessment_document_content_checklist:BADocumentContentChecklst;
    created_at:string;
    created_by:CreatedBy;
    description:string;
    reference_code:string;
    completion:any;
}

export interface BADocumentContentChecklst{
    id:number;
    checklist_id:number;
}

export interface BAActionPlanPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    from:number;
    data:ActionPlans[];
}

export interface HistoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: History[];
}

export interface History{
    id: number;
    comment: string;
    percentage: number;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    updated_at: string;
    business_assessment_action_plan_status_title: string;
    business_assessment_action_plan_status_id: number;
    business_assessment_action_plan_title: string;
    business_assessment_action_plan_status_label:string;
    documents:Document[];
    label:string;
}




