export interface AssetCount{
    acquired_count: number;
    disposed_count: number;
    maintenance_count: number;
    total_assets: number;
}

export interface AssetPieStatus{
    asset_status: string;
    count: number;
    id: number;
    percentage: number;
    type: string;
}

export interface AssetPieTypes{
    asset_type: string;
    count: number;
    id: number;
    percentage: number;
}

export interface AssetCriticalityRating{
    asset_rating: string;
    asset_rating_color_code: string;
    asset_rating_label: string;
    count: number;
    id: number;
    percentage: number;
}

export interface AssetMaintanancePieStatus{
    asset_maintenance_status: string;
    asset_maintenance_status_color_code: string;
    asset_maintenance_status_label: string;
    count: number;
    id: number;
    percentage: number;
}

export interface AssetBarCategory{
    asset_category: string;
    department_code: string;
    count: number;
    id: number;
}

export interface AssetBarCustodian{
    asset_custodian: string;
    count: number;
    id: number;
}

export interface AssetBarPurchaseYear{
    total_count: number;
    year: number;
}

export interface AssetBarDepartment{
    count: number;
    department: string;
    id: number;
}

export interface MaintenanceBarAsset{
    asset: string;
    count: number;
    id: number;
}

export interface MaintenanceBarCategory{
    asset_category: string;
    count: number;
    id: number;
}

export interface MaintenanceBarType{
    asset_maintenance_type_title: string;
    count: number;
    id: number;
}

export interface MaintenanceBarFrequency{
    asset_maintenance_schedule_frequency_title: string;
    count: number;
    id: number;
}