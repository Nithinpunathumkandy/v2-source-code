import { CreatedBy } from "../../general/created_by";
import { CustomerComplaintDocuments, CustomerComplaintStatus } from "../customer-complaint/customer-complaint";

export interface Customers {
    address: string;
    contact_person: string;
    contact_person_email: string;
    contact_person_number: string;
    contact_person_role: string;
    created_at: string;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    email: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    mobile: string;
    reference_code: string;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
    website: string;
}

export interface CustomersPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Customers[];
}

export interface IndivitualCustomers {
    address: string;
    complaints: CustomerComplaintsList[];
    contact_person: string;
    contact_person_email: string;
    contact_person_number: string;
    contact_person_role: string;
    created_at: string;
    created_by: CreatedBy;
    email: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    mobile: string;
    status: CustomerStatus;
    title: string;
    website: string;
}

export interface CustomerStatus{
    id: number;
    label: string;
    title: CustomerStatusTitle[]
}

export interface CustomerStatusTitle{
    code: string;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {status_id: number, language_id: number, title: string}
    status_id:number;
    title: string;
    type: string;
}

export interface CustomerComplaintsList{
    branch_id: number;
    created_at: string;
    customer_complaint_source_id: number;
    customer_complaint_status: CustomerComplaintStatus;
    customer_complaint_status_id: number;
    customer_complaint_type_id: number;
    customer_id: number;
    department_id: number;
    description: string;
    division_id: number;
    documents: CustomerComplaintDocuments[]
    id: number;
    is_non_conformity: number;
    organization_id: number;
    receiving_date: string;
    reference_code: string;
    responsible_user_id: number;
    section_id: number;
    sub_section_id: number;
    title: string;
}
export interface CustomerComplaints{
    count: number;
    id: number;
    title: string;
}

export interface CustomerComplaintsResponse{
    total_complaint: number;
    data: CustomerComplaints[];
}

export interface CustomerFeedbacks{
    count: number;
    id: number;
    title: string;
}

export interface CustomerFeedbacksResponse{
    total_feedback : number;
    data: CustomerFeedbacks[];
}