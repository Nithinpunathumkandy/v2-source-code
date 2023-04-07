export interface UnsafeActionSubCategory {
    id: number;
    title: string;
    description: string;
    unsafe_action_category_id:number;
    status: string;
    status_id :number;
    status_label: string;
}
export interface UnsafeActionSubCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: UnsafeActionSubCategory[];
}