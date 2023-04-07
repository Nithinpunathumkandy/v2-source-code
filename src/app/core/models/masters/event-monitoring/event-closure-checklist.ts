export interface EventClosureChecklist {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    event_closure_checklist_title: string;
}

export interface EventClosureChecklistPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventClosureChecklist[];
}
export interface EventClosureChecklistSingle {
    id: number;
    languages: EventClosureChecklistLanguage[];
    
}
export interface EventClosureChecklistLanguage{
    id:number;
    event_closure_checklist:EventClosureChecklistSingleLanguage[]
}
export interface EventClosureChecklistSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}