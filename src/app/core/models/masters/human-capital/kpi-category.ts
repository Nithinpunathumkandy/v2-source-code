export interface KpiCategory {
    id: number;
    title: string;
    description:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface KpiCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KpiCategory[];
}