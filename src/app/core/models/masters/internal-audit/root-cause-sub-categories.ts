export interface RootCauseSubCategory {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    root_cause_category_id: number;
    root_cause_category_title:string;
}
export interface RootCauseSubCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: RootCauseSubCategory[];
}
