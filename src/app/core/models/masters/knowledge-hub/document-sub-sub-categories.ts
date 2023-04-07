export interface DocumentSubSubCategory {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    description: string;
    document_sub_category_id: number;
}

export interface DocumentSubSubCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: DocumentSubSubCategory[];
}