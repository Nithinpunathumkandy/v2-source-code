export interface AssetMatrixCategories {
    id: number;
    title:string;
    description:string;
    status: string;
    status_id :number;
    status_label: string;
    type:string;
}

export interface AssetMatrixCategoriesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: AssetMatrixCategories[];
}
