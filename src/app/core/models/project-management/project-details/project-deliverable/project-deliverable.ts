export interface Deliverable {
    id: number;
    item: string;
    TargetDate:string;
    ResponsibleUser: string;
    Status: string;
    status_id :number;
    status_label: string;
}

export interface DeliverablePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: Deliverable[];
}