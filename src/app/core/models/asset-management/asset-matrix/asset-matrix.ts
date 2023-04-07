import { AssetCategory } from '../../masters/asset-management/asset-category';

export interface AssetMatrix {
    id: number;
    title: string;
    asset_calculation_method_title: string;
    status: string;
    asset_matrix_categories :string;
    status_label: string;
    asset_categories:string;
}
export interface AssetMatrixPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetMatrix[];
}

export interface AssetMatrixSaveResponse {
    id: number;
    message: string;
}

export interface IndividualAssetMatrix {
    asset_ratings: any;
    asset_matrix_categories: any;
    asset_option_values:any;
    asset_calculation_method: any;
    title: any;
    id: any;
    asset_categories: AssetCategory[];
    purchased_date: string;
    
}