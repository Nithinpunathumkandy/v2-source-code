export interface CustomerComplaintSource{
    id:number;
    title:string;
    description: string;
    status_id :number;
}
export interface CustomerComplaintSourcePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CustomerComplaintSource[];
}