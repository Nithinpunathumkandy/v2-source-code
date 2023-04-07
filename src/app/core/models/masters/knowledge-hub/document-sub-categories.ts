export interface DocumentSubCategory {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    description: string;
    document_category_id: number;
}

export interface DocumentSubCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: DocumentSubCategory[];
}