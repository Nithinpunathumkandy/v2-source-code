import { StringifyOptions } from 'querystring';

export interface Job {
    id: number;
    user_id: number;
    title: string;
    description:string;
    documents: Documents[];
    is_deleted: boolean;
    image_token: string;
    is_accordion_active?: boolean;
    created_at:string;
    status: string;
    status_id: number;
    status_label: string;
}



export interface JobPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: Job[];
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


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}
