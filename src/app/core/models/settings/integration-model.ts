export interface IntegrationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Integration[];
}

export interface Integration {
    created_by:number;
    status_label:string;
    status_id:number;
    status:string;
    title:string;
    type:string;
    type_group:string;
    icon:string;
}