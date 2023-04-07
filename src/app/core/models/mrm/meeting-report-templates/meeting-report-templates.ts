import { Status } from "../../status.model";

export interface ReportTemplates{
    id: number;
    title: string;
    reference_code:string;
    status:Status;
    status_id:number;
    status_label:string;
    token: string;
    pages:Pages[];
}

export interface ReportTemplatesResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ReportTemplates[];
}

export interface Pages{
    id:number;
    is_enable:number;
    label_id:number;
    meeting_report_template_id:number;
    order:number;
    status_id:number;
    fields:Fields[];
}

export interface Fields{
    id:number;
    is_enable:number;
    label_id:number;
    order:number;
    status_id:number;
    documents:Documents[]
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