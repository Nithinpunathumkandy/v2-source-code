export interface StorageLocation{
    id:number;
    title:string;
    type: string;
    status_id :number;
   
}
export interface StorageLocationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StorageLocation[];
}