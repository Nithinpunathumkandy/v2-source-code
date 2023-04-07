export interface RiskCategory {
    id: number;
    title: string;
    description: string;
    color_code:string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface RiskCategoryPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskCategory[];
}

