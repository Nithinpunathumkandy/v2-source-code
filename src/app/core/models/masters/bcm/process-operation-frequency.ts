export interface ProcessOperationFrequency{
    id:number;
    title:string;
    status_id :number;
}
export interface ProcessOperationFrequencyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProcessOperationFrequency[];
}