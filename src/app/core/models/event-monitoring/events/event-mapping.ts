import { CreatedBy } from "../../general/created_by";
export interface EventMappingResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventMapping[];
}

export interface EventMapping{
    created_at: string;
    created_by: CreatedBy;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    event_status_label:string;
    event_status_color:string;
    event_status_title:string;
    created_by_status: string;
    event_location_title:string;
    description: string;
    risk_category:string;
    risk_departments:string;
    risk_status:string;
    risk_types:string;
    end_date: string;
    id: number;
    owner_firstname: string;
    owner_lastname: string;
    event_owner_designation:string;
    reference_code: string;
    start_date: string;
    title: string;
}