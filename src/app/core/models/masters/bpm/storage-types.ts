export interface StorageTypes{
    id:number;
    title:string;
    type: string;
    status_id :number;
   
}
export interface StorageTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StorageTypes[];
}