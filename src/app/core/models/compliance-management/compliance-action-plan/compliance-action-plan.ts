
import { CreatedBy } from "../../bpm/process/activity";
import { ResponsibleUser } from "../../customer-satisfaction/customer-complaint-action-plans/customer-complaint-action-plans";
import { Language } from "../../internal-audit/audit-program/audit-program";


export interface ActionPlans {
    id: number;
    title: string;
    description: string;
    reference_code: string;
    document_id: number;
    start_date: string;
    first_name: string;
    last_name: string;
    target_date: string;
    responsible_user_id: number;
    document_reference_code: string;
    document_title: string;
    document_description?: any;
    document_action_plan_status_id: number;
    label: string;
    document_action_plan_status_language_title: string;
    created_by: number;
    created_by_first_name: string;
    created_by_last_name: string;
    created_by_image_token: string;
    created_by_designation: string;
    created_by_department: string;
    created_by_status: string;
    created_at: string;
    updated_by: number;
    updated_by_first_name: string;
    updated_by_last_name: string;
    updated_by_image_token: string;
    updated_by_designation: string;
    updated_by_department: string;
    updated_by_status: string;
    updated_at: string;
  }
export interface ComplianceRegisterActionPlanStatus{

    id:number;
    type:string;
    label:string;
    language:Language;
    created_by:CreatedBy
}

export interface ComplianceRegisterActionPlanDetails{

    id:number;
    title:string;
    responsible_user_id:ResponsibleUser;
    start_date: string;
    target_date: string;
    document_action_plan_status:ComplianceRegisterActionPlanStatus;
    created_at:string;
    created_by:CreatedBy;
    description:string;
    reference_code:string;
    completion:any;
    document_id:number;
}

export interface ComplianceRegisterDocumentContentChecklst{
    id:number;
    checklist_id:number;
}

export interface ComplianceRegisterActionPlanPaginationResponse{
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
    compliance_action_plan_status_title: string;
    compliance_action_plan_status_id: number;
    compliance_action_plan_title: string;
    compliance_action_plan_status_label:string;
    documents:Document[];
    label:string;
}




