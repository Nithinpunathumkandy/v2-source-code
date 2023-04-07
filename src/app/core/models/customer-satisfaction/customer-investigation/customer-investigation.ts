import { CreatedBy } from "../../bpm/controls/controls";
import { CustomerComplaintDocuments } from "../customer-complaint/customer-complaint";

export interface CustomerInvestigation{
    
    customer_complaint_id: number;
    customer_complaint_investigation_status_id: number;
    customer_complaint_investigation_status_title: string;
    customer_complaint_title: string;
    description: string;
    id: number;
    reference_code: string;

}



export interface CustomerInvestigationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CustomerInvestigation[];
}

export interface IndivitualCustomerInvestigation {

    created_at: string;
    created_by: CreatedBy[];
    customer_complaint: {
        id: number;
        reference_code: string; 
        customer_complaint_type_id: number;
        customer_id: number;
        title:string;
    }
    customer_complaint_investigation_status: {
        id: number; 
        type: string; 
        created_at: string;
    }
    description: string;
    documents: Documents[]
    id: number;
    reference_code: string;
    is_previous_non_conformity: number;
    customer_complaint_id;
    customer_complaint_title;
  
}

export interface ComplaintInvestigations{
    created_at: string;
    created_by: number;
    customer_complaint_id: number;
    customer_complaint_investigation_status_id: number;
    description: string;
    documents: CustomerComplaintDocuments[];
    id: number;
    is_previous_non_conformity: number;
    non_conformity: any;
    non_conformity_id: number;
    reference_code: string;
    customer_complaint_title;
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_job_id:string;
}