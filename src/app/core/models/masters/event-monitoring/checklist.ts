export interface Checklist {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    event_checklist_title: string
}

export interface ChecklistPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Checklist[];
}
export interface ChecklistSingle {
    id: number;
    languages: ChecklistLanguage[];
    
}
export interface ChecklistLanguage{
    id:number;
    checklist:ChecklistSingleLanguage[]
}
export interface ChecklistSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}