import { Unit } from '../../general/unit';

export interface ProfileKPI{
    id: number;
    user_id: number;
    kpi_id: number;
    kpi_title: string;
    process_id: number;
    process_title: string;
    status: string;
    status_id: number;
    status_label: string;
    target: string;
    unit_id: number;
    unit_title: string;
    documents: Documents[];
    unit:Unit;
    process:Process;

} 

export interface ProfileKPIPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProfileKPI[];
}

export interface Documents {
    id: number,
    token: string,
    title: string,
    ext: string,
    size: string,
    url: string,
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_kpi_id:string;
}

export interface Process{
    id:number;
    title:string;
}