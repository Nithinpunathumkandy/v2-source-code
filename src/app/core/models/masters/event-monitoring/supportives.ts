export interface Supportives{
    id:number;
    title:string;
    description: string;
    order:number;
    status_id :number;
}
export interface SupportivesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Supportives[];
}