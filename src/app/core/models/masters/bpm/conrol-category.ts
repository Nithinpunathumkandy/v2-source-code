export interface ControlCategory {
    id: number;
    title: string;
    status_id: number;
    status: string;
    reference_code:number;
    status_label: string;
}

export interface ControlCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    from: number;
    last_page: number;
    data: ControlCategory[];
}