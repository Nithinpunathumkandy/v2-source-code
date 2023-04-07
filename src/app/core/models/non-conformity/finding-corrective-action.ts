import { Findings } from "./findings";

export interface FindingsCorrectiveActions {
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    department: string;
    finding_corrective_action_status: string;
    finding_corrective_action_status_id: number;
    finding_corrective_action_status_label:string;
    finding_id: number;
    id: number;
    reference_code: string;
    responsible_user_designation: string;
    responsible_user_first_name: string;
    responsible_user_id: number;
    responsible_user_image_ext: string;
    responsible_user_image_sizee: number;
    responsible_user_image_title: string;
    responsible_user_image_token: string;
    responsible_user_image_url: string;
    responsible_user_last_name: string;
    start_date: string;
    target_date: string;
    title: string;
}
export interface FindingsCorrectiveActionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: FindingsCorrectiveActions[];
}

export interface IndividualCorrectiveAction {
    id: number;
    title: string;
    description: string;
    start_date: Date;
    target_date: Date;
    finding_id: number;
    finding : {
        audit_id: number;
        audit_schedule_id: number;
        created_at: string;
        created_by: number;
        departments: Department[];
        description: string;
        document_id: number;
        external_audit_id: number;
        finding_category_id: number;
        finding_status_id: number;
        id: number;
        reference_code: string;
        risk_rating_id: number;
        title:string;
    };
    // finding: Findings;
    reference_code: string;
    responsible_user: ResponsibleUsers;
    corrective_action_status: Status;
    documents: Documents[];
    created_by: CreatedBy;
    created_at: string;
    finding_corrective_action_update:CorrectiveActionUpdate[];
   
    
}

export interface caHistoryPaginationData{
    data:caHistoryData[]
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    comment:string;
    documents:Documents;
}

export interface caHistoryData{
    created_at:string;
    created_by:number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    finding_corrective_action_status_id: number;
    finding_corrective_action_status_title: string;
    id: number;
    percentage: number;
    treatment_title: string;
    updated_at: string;
    updated_by: string;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: string;
    updated_by_last_name: string;
    updated_by_status: string;
}



export interface CorrectiveActionUpdate{
    id:number;
    finding_corrective_action_id:number
    finding_corrective_action_status_id:number
    percentage:number;
    comment:string;
    created_by:CreatedBy
    created_at: string;
    finding_corrective_action_update_documents:Image[]


}

export interface Status {
    id: number;
    language: Language[];
    type:string;
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}
export interface CreatedBy {
    designation: string;
    first_name: string;
    last_name: string;
    image: Image;
}

export interface ResponsibleUsers {
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status: {
        id: number;
    }
    designation: string,
    image_token: string;
    image: Image
}

export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    image_token: string;
    size: number;
    ext: string;
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
}

export interface Department{
    id: number;
    title: string;
}