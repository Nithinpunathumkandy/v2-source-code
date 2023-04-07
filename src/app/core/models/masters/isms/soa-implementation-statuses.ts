export interface SoaImplementationStatuses {
    id: number;
    title: string;
    color_code:string;
    description:string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface SoaImplementationStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SoaImplementationStatuses[];
}