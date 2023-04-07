export interface CaComment {
    id:number;
    description: string;
    documents:Documents[];
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_last_name: string;
    created_by_image_token:string;
    created_at:any;
}

export interface CaCommentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CaComment[];
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