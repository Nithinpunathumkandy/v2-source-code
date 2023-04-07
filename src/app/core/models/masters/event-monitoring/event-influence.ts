export interface EventInfluence{
    id:number;
    title:string;
    description: string;
    order:number;
    status_id :number;
}
export interface EventInfluencePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventInfluence[];
}