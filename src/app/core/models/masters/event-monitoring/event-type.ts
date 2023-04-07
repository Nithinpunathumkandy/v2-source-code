export interface EventType {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface EventTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventType[];
}
export interface EventTypeSingle {
    id: number;
    languages: EventTypeLanguage[];
    
}
export interface EventTypeLanguage{
    id:number;
    event_type:EventTypeSingleLanguage[]
}
export interface EventTypeSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}