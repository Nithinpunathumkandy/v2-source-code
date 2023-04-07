
import { Department } from "../../../department.model";



export interface IncidentCorrectiveAction {
    id: number;
    title: string;
    incident: {id:number};
    incident_id: number;
    start_date : Date;
    target_date : Date;
    budget : number;
    created_by_department: string;
    responsible_user_id_first_name : string;
    responsible_user_id_last_name : string;
    responsible_user_id_designation : string;
    incident_status_title : string;
    corrective_action_status: Status;
    incident_corrective_action_status:Status;
    incident_corrective_action_update: CorrectiveActionStatusUpdates[];
    incident_corrective_action_watchers:Watchers[];
    action : string;
    documents: Documents[];
    responsible_user:ResponsibleUsers;
    image;
    status;
    description : string;
    incident_status;
    location : string;
    reported_at : string;
    responsible_user_id : User;
    reference_code : string;
    created_by: CreatedBy;
    created_at: string;
    accepted_by :{
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
    next_review_user_level;
    submitted_by;
    workflow_items;
}

export interface CorrectiveActionStatusUpdates{
    comment: string;
    created_at: string;
    created_by: CreatedBy
    incident_corrective_action_id: number;
    incident_corrective_action_status_id: number;
    documents: Documents[]
    id: number;
    percentage: number;
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
export interface Status{
    id:number;
    language: Language[];
    title: string;
    label: string;
}
export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
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

  export interface Watchers{
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


export interface IncidentCorrectiveActionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentCorrectiveAction[];
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


export interface User {
    id: number;
    name: string;
    email: string;
    language: {code: string,
                id: number,
                is_primary: number,
                is_rtl: number,
                status_id: number,
                title: string,
                type: string};
    department: Department;
    status: Status;
    image_token: string;
    last_name: string;
    mobile:number;
}

export interface HistoryData {
    data:History[];
    current_page: number;
     total: number;
     per_page: number;
     last_page: number;
 }
 
 export interface History{
     id: number;
     incident_corrective_action_title: string;
     percentage: number;
     amount_used: string;
     created_at: string
     created_by: number
     created_by_department: string;
     created_by_designation: string;
     created_by_first_name: string;
     created_by_image_token: string;
     created_by_last_name: string
     created_by_status: string;
     incident_corrective_action_status_id: number
     incident_corrective_action_status_title: string;
     updated_at: string;
     documents:Document[];
     label:string;
     comment : string;
 
 }

 export interface Document {
    id: number;
    name: string;
    ext: string;
    mime_type: string;
    size: number;
    url: string;
    thumbnail_url: string;
    token: string;
    title:string;
    risk_treatment_update_id:number;
  }

