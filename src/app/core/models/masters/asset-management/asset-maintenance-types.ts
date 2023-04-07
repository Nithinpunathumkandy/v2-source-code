export interface AssetMaintenanceTypes {
    id: number;
    type: string;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface AssetMaintenanceTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetMaintenanceTypes[];
}