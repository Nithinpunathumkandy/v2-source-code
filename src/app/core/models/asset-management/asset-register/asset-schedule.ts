export interface AssetMaintenanceSchedule {
    
    asset_maintenance_reference_code:string;
    id:number;
    title:string;
    asset_title:string;
    asset_maintenance_title:string
    frequency_title:any;
    asset_maintenance_schedule_frequency:string;
    scheduled_date:string;
    actual_date:string;
    responsible_user_first_name:string;
    responsible_user_id:number;
    responsible_user_image_token:string;
    responsible_user_last_name:string;
    created_by:any;
    created_at:string;
    supplier_id:number;
    supplier_image_token:string;
    supplier_title:string;
    asset_maintenance_schedule_status:any;
}

export interface AssetMaintenanceSchedulePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetMaintenanceSchedule[];
}
export interface AssetMaintenance {
    reference_code:string;
    id:number;
    asset_id:number;
    title:string;
    description:string;
    asset:any;
    asset_maintenance_status_id:number
}

export interface AssetMaintenanceScheduleShutdown {
    id:number;
    title:string;
    description:string;
    end_date:string;
    start_date:string;
    type:string;
}
export interface AssetMaintenanceScheduleSupplier {
    image_url:string;
    id:number;
    title:string;
    email:string;
    image_token:string;
}

export interface AssetMaintenanceScheduleResponsibleUser {
    image_url:string;
    id:number;
    designation:any;
    first_name:string;
    last_name:string;
    email:string;
    image_token:string;
}

export interface IndividualAssetMaintenanceSchedule{
    frequency_title:string;
    created_by: any;
    title:string;
    id:number;
    actual_date:string
    scheduled_date:string;
    asset_maintenance:AssetMaintenance;
    asset_maintenance_schedule_status:any;
    asset_maintenance_schedule_shutdowns:AssetMaintenanceScheduleShutdown[];
    responsible_users:[];
    latest_asset_maintenance_schedule_update:any;
    supplier:AssetMaintenanceScheduleSupplier;

}

