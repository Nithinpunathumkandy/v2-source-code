export interface Entrance {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface EntrancePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Entrance[];
}
export interface EntranceSingle {
    id: number;
    languages: EntranceLanguage[];
    
}
export interface EntranceLanguage{
    id:number;
    entrance:EntranceSingleLanguage[]
}
export interface EntranceSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}