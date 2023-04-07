export interface BcsTypes {
    description: string;
    id: number;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
}
export interface BcsTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BcsTypes[];
}