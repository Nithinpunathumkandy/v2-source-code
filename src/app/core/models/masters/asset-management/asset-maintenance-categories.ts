export interface AssetMaintenanceCategories {
    id: number;
    title:string;
    description:string;
    status: string;
    status_id :number;
    status_label: string;
    type:string;
}

export interface AssetMaintenanceCategoriesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: AssetMaintenanceCategories[];
}
