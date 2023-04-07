import { CreatedBy } from '../../bpm/process/processes';

export interface Report{
    id:number;
    title:string;
    report_frequency_id:number;
    description:string;
    documents:Documents[];
    report_frequency:Frequency;
    created_by:CreatedBy;
    updated_by:CreatedBy;
    status: string;
    status_id: number;
    status_label: string;
}

export interface Frequency{
    id:number;
    title:string;
}

export interface ReportPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Report[];
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
    user_report_id:string;
}