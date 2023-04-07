export interface Range {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface RangePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Range[];
}
export interface RangeSingle {
    id: number;
    languages: RangeLanguage[];
    
}
export interface RangeLanguage{
    id:number;
    range:RangeSingleLanguage[]
}
export interface RangeSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}