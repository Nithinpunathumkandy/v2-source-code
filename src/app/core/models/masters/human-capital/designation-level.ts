export interface DesignationLevel {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    order : number;
}
export interface DesignationLevelPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: DesignationLevel[];
}