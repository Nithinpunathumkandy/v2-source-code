import { AuditFindings } from '../audit-findings';



export interface CorrectiveAction {
    am_audit_finding: any;
    id: number;
    title: string;
    description:string;
    start_date: Date;
    target_date: Date;
    reference_code:number;
    finding_corrective_action_status_id:number;
    am_audit_finding_corrective_action_status;
    findings: AuditFindings;
    responsible_user:ResponsibleUsers;
    corrective_action_status;
    finding_id:number;
    finding_corrective_action_status_updates:CorrectiveActionStatusUpdates[]
    documents: Documents[];
    am_audit_finding_corrective_action_documents : Documents[];
    created_by;
    created_at: string;
    closed_by :{
        created_at:string;
        created_by: {
            id: number,
            first_name: string,
            last_name: string,
            email: string;
            mobile: number;
            status:{
                id:number;
            }
            designation: string,
            image_token: string;
            image:Image
        }
    },

    resolved_by :{
        created_at:string;
        comment: string;
        percentage: number;
        documents: Documents[];
        created_by :{
            id: number,
            first_name: string,
            last_name: string,
            email: string;
            mobile: number;
            status:{
                id:number;
            }
            designation: {
                title:string;
            },
            image_token: string;
            status_id : number;
            image:Image
        }
    }

}

export interface caHistoryPaginationData {
    data: caHistoryData[]
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    comment: string;
    documents: Documents;
}

export interface caHistoryData {
    created_at: string;
    created_by: number;
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
    finding_corrective_action_update_documents: HistoryDocPreview;
}
export interface HistoryDocPreview {
    created_at: string;
    created_by: number;
    document_id: number;
    ext: string;
    finding_corrective_action_update_id: number;
    id: number;
    kh_document: string;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    updated_at: string;
    updated_by: string;
    url: string;
}

export interface CorrectiveActionStatusUpdates{
    comment: string;
    created_at: string;
    created_by: CreatedBy
    finding_corrective_action_id: number;
    finding_corrective_action_status_id: number;
    finding_corrective_action_update_documents: Documents[]
    id: number;
    percentage: number;
}


export interface Status{
    id:number;
    language: Language[];
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}
export interface CreatedBy{
    designation: string;
    first_name: string;
    last_name: string;
    image:Image;
  }

export interface CorrectiveActionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CorrectiveAction[];
}


export interface ResponsibleUsers{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status:{
        id:number;
    }
    designation: string,
    image_token: string;
    image:Image
  }

  export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    image_token:string;
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
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
}