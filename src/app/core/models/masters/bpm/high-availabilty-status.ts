export interface HighAvailabilityStatus{
    id:number;
    title:string;
    description: string;
    status_id :number;
}
export interface HighAvailabilityStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: HighAvailabilityStatus[];
}