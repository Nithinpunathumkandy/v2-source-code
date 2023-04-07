import { Status } from '../../status.model';
import { CreatedBy } from './user-kpi';
import { IndividualUser } from './users';


export interface Report {
    id:number;
    report_frequency_id: number;
    report_frequency:Frequency;
    reports:ReportData[];
    // title:string;
    // description:string;
    // documents:Documents[];
    // submitted_to:SubmittedTo[];
    // created_at:string;
    // updated_at:string;
    // created_by:SubmittedTo;
    // updated_by:UpdatedBy;
    // status:Status;
}

export interface ReportData{
    id:number;
    created_at:string;
    created_by:CreatedBy;
    status:Status;
    submitted_to_users:SubmittedTo[];
    updated_at:string;
    updated_by:UpdatedBy;
    user:IndividualUser;
    user_report:UserReport;
}

export interface UserReport{
    id:number;
    title:string;
    description:string;
    created_at:string;
    created_by:number;
    documents:Documents;
    report_frequency_id:number;
    report_frequency:Frequency;
}

export interface Frequency{
    id:number;
    title:string;
    status_id:number;
}

export interface Documents{
    id:number;
    user_report_id:number;
    title:string;
    url:string;
    size:number;

}

export interface SubmittedTo{
    id:number;
    name:string;
    email:string;
    image_url:string;
    designation:string;

}

export interface UpdatedBy{

}


