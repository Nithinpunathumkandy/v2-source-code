import { array, number } from "@amcharts/amcharts4/core";
import { ResponsibleUser } from "../../bpm/process/activity";


export interface Checklist {
    id: number;
    title: string;
    closed_by: CreatedBy
    description: string;
    reference_code: number;
    start_date: string;
    target_date: string;
    created_by: CreatedBy;
    created_at: string;
}

export interface IndividualChecklist {
    id: number;
    title: string;
    closed_by: CreatedBy
    details_of_the_incident: string;
    cyber_incident_classification:any;
    cyber_incident_impacts:impact[],
    reference_code: number;
    status:any;
    occurred: string;
    reporting_user:ResponsibleUser[];
    cyber_incident_status:any;
    detected: string;
    created_by: CreatedBy;
    created_at: string;
    submitted_by:any;
    next_review_user_level:any;
    work_flow_items:any[];
}

export interface impact{
    id:number,
    title:string;
}
export interface CreatedBy {
    designation: string;
    first_name: string;
    last_name: string;
    image: Image;
}

export interface ChecklistPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Checklist[];
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





