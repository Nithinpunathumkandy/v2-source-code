export interface ControlSubcategory {
    id: number;
    title: string;
    control_category_id:number,
    status_label: string;
    status:string;
    status_id: number;
    control_category_title: string;
    reference_code: number;
}

export interface ControlSubcategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    from: number;
    last_page: number;
    data: ControlSubcategory[];
}