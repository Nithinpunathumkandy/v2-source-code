export interface AssetStatus {
    id: number;
    asset_status_language_title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface AssetStatusPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: AssetStatus[];
}