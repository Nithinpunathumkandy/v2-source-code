export interface Dimension {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface DimensionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Dimension[];
}
export interface DimensionSingle {
    id: number;
    languages: DimensionLanguage[];
    
}
export interface DimensionLanguage{
    id:number;
    dimension:DimensionSingleLanguage[]
}
export interface DimensionSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}