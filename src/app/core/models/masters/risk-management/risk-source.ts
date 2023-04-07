export interface RiskSource {
    id: number;
    title: string;
    color_code:string;
    description:string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface RiskSourcePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskSource[];
}



