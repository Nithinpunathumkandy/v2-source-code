export interface JsoSubCategory {
    id: number;
    title: string;
    description: string;
    jso_category_id:number;
    status: string;
    status_id :number;
    status_label: string;
}
export interface JsoSubCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: JsoSubCategory[];
}