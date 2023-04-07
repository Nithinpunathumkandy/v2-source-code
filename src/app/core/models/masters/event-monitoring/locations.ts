export interface Locations {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface LocationsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Locations[];
}
export interface LocationsSingle {
    id: number;
    languages: LocationsLanguage[];
    
}
export interface LocationsLanguage{
    id:number;
    locations:LocationsSingleLanguage[]
}
export interface LocationsSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}