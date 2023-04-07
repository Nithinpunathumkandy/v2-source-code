export interface BusinessApplicationTypes{
    id:number;
    title:string;
    status_id :number;
}
export interface BusinessApplicationTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BusinessApplicationTypes[];
}