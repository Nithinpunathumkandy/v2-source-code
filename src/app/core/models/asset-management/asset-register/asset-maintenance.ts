export interface AssetMaintenance {
    
    id: number;
    title: string;
}

export interface AssetMaintenancePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetMaintenance[];
}

export interface IndividualAssetMaintenance{
    created_by: any;
    asset_maintenance_schedule_frequency: any;
    asset_maintenance_schedules: any;
    id:number;
    title:string;
    description:string;
    reference_code:string;
    asset_maintenance_status:any;
    asset_maintenance_category:any;
    asset_maintenance_type:any;
    warranty_year:number;
    warranty_month:number;
    is_warranty:number;
    is_guarantee:number;
    total_cost:any;
    is_shutdown:boolean;
    asset:any;



}

