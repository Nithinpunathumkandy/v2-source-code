export interface KPITypes {
    id : number;
    type : string;

}

export interface KPITypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KPITypes[];
}