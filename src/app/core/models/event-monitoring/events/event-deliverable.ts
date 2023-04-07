

export interface Deliverable {
   
    title: string;
    description: string;
    id;
    
}

export interface DeliverablePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: Deliverable[];
}