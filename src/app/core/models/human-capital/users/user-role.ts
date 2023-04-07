import { StringifyOptions } from 'querystring';

export interface UserRole {
    id: number;
    user_id: number;
    title: string;
    description:string;
    documents: Documents[];
    is_deleted: boolean;
    image_token: string;
    responsible_user:Reporting[];
    supervisor:Reporting;
    is_accordion_active?: boolean;
    created_by:Reporting;
    created_at:string;
}

export interface Reporting{
    id:number;
    designation:string;
    email:string;
    first_name:string;
    last_name:string;
    image:Image;
    mobile:number;
}

export interface UserRolePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: UserRole[];
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
    user_role_id:string;
}


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}
