export interface AvailableAuditors {
    id: number;
    designation_id:number;
    first_name: string;
    last_name: string;
    email: string;
    image_token: string;
    status_id: number;
    designation:{
        title:string;
    }
    department:{
        title: string;
    }
    total_audits: number;

    audit_categories: Categories[];
}

export interface Categories {
    id:number;
    title: string;
}
export interface AvailableAuditorsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    from: number;
    last_page: number;
    data: AvailableAuditors[];
}