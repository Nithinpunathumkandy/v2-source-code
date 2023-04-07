export interface Venue {
    id: number;
    title: string;
    description:string;
    status: string;
    status_id :number;
}

export interface VenuePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: Venue[];
}



