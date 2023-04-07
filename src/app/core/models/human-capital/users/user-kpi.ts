import { Unit } from '../../general/unit';
import { Kpi } from '../../masters/human-capital/user-kpi';
import { Status } from './users';

export interface UserKpi {
    id: number;
    user_id: number;
    kpi_id: number;
    kpi:Kpi;
    // description:string;
     documents: Documents[];
    // is_deleted: boolean;
    // image_token: string;
    is_accordion_active?: boolean;
    target:string;
    unit:Unit;
    process:Process;
    process_id:number;
    created_at:string;
    created_by:CreatedBy;
    kpi_title:string;
}

export interface UserKpiPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: UserKpi[];
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


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}

export interface CreatedBy{
    id:number;
    first_name:string;
    email:string;
    designation:string;
    image:Image;
    department:String;
    last_name:String;
    status:Status;

}


export interface Process{
    id:number;
    title:string;
}
