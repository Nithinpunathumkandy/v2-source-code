export interface AssetLocation {
    id: number;
    title: string;
    description:string;
    locations_title: string;
    location_id: number;
    status: string;
    status_id: number;
    status_label: string;
}

export interface AssetLocationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetLocation[];
}

export interface IndividualAssetLocation {
    id: number;
    description: string;
    title: string;
    location:{
        id: number;
        status_id: number;
        title: string
    }
}