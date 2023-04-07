export interface AssetCategory {
    id: number;
    title: string;
    description:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface AssetCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetCategory[];
}