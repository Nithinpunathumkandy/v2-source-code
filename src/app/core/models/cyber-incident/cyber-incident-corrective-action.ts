export interface CyberIncidentCorrectiveActionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CyberIncidentCorrectiveAction[];
}

export interface CyberIncidentCorrectiveAction{
    id: number;
    title: string;
    closed_by: CreatedBy
    description:string;
    cyber_incident_id: number;
    start_date: string;
    target_date: string;
    estimated_cost: number;
    cyber_incident: {
        id: number;
    };
    responsible_user:ResponsibleUsers[];
    cyber_incident_corrective_action_status: CorrectiveActionStatus;
    cyber_incident_corrective_action_status_updates: CorrectiveActionStatusUpdates[];
    percentage : number;
    days_remaining: number;
    documents: Documents[];
    created_by: CreatedBy;
    created_at: string;
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

export interface CorrectiveActionStatusUpdates{
    comment: string;
    created_at: string;
    created_by: CreatedBy
    cyber_incident_corrective_action_id: number;
    cyber_incident_corrective_action_status_id: number;
    cyber_incident_corrective_action_update_documents: Documents[]
    id: number;
    percentage: number;
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
    
export interface CorrectiveActionStatus{
    color_code: string;
    id: number;
    label: string;
    languages: CorrectiveActionLanguage[]
    type: string;
}
    
export interface CorrectiveActionLanguage{
    code: string;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: CorrectiveActionPivot
    status_id: number;
    title: string;
    type: string;
}
    
export interface CorrectiveActionPivot{
    finding_corrective_action_status_id: number, 
    language_id: number, 
    title: string;
}
export interface CreatedBy{
    designation: string;
    first_name: string;
    last_name: string;
    image:Image;
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
    cyber_incident__corrective_action_status_id: number;
    cyber_incident__corrective_action_status_title: string;
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
    cyber_incident_corrective_action_update_documents: HistoryDocPreview;
}
export interface HistoryDocPreview {
    created_at: string;
    created_by: number;
    document_id: number;
    ext: string;
    cyber_incident__corrective_action_update_id: number;
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
