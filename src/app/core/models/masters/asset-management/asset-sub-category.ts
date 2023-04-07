export interface AssetSubCategory {
    id: number;
    title: string;
    asset_category_id: number;
    description:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface AssetSubCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetSubCategory[];
}
