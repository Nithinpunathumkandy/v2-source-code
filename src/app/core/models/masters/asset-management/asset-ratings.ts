export interface AssetRatings {
    label: any;
    id: number;
    title: string;
    type: string;
    status: string;
    status_id: number;
    status_label: string;
    description: string;
}

export interface AssetRatingsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetRatings[];
}