import { Status } from '../../status.model';

import { IndividualUser } from '../users/users';
import { CreatedBy } from '../users/user-document';




export interface Report {
    id:number;
    title:string;
    user_user_report_id:number;
    year:number;
    quarter:number;
    month:number;
    week:number;
    day:number;
    documents:Documents[];
    user_actual_report:Report;
    user_user_report:UserReport;
    user_report_status:ReportStatus;
    created_at:string;
    created_by:CreatedBy;
    updated_at:string;
    updated_by:string;
   
}

export interface ReportPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: Report[];
}


export interface Documents{
    id:number;
    user_actual_report_id:number;
    title:string;
    url:string;
    size:number;
    created_at:string;
    created_by:CreatedBy;
    updated_at:string;
    updated_by:string;
    token:string;
    ext:string;
    create_by_image_token:string;

}

export interface UserReport{
    id:number;
    title:string;
}

export interface ReportStatus{
    id:number;
    is_approved:number;
    is_draft:number;
    is_submitted:number;
    is_rejected:number;
    is_reviewed:number,
    title:string;
}





