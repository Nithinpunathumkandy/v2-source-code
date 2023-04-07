export interface KpiTypes {
    id: number;
    status: string;
    status_id :number;
    status_label: string;
    type:string;
    title:string;
    description:string;
}

export interface KpiTypesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: KpiTypes[];
}
