export interface Objectives {
    id : number;
    status_id : number;
    title : string;
    focus_area_id : number

}

export interface ObjectivePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Objectives[];
}