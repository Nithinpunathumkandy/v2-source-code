import { CreatedBy } from '../../bpm/process/processes';
import { UserReport } from '../../human-capital/users/user-report';
import { Report } from '../../masters/human-capital/user-report';

export interface ProfileReport{
    report_frequency: string;
    report_frequency_id: number;
    reports:ReportArray[];
}
export interface ReportArray{
    id:number;
    created_by:CreatedBy;
    submitted_to_users:ReportTo[];
    user_report:UserReport;
}

export interface ReportTo{
    designation: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    image:reporterImage[];
}
export interface reporterImage{
    ext: string;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    url: string;
}
