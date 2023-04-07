export interface RiskLibrary {
    id: number;
    title: string;
    description:string;
    status: any;
    status_id :number;
    status_label: string;
    // risk_areas:any;
    // risk_types:any;
    // risk_sources:any;
    // risk_category:any
    // impact:any
}

export interface RiskLibraryPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskLibrary[];
}



