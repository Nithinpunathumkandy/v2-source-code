export interface Tag {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    description: string;
}

export interface TagPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Tag[];
}