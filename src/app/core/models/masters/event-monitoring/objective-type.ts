export interface ObjectiveType {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ObjectiveTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ObjectiveType[];
}
export interface ObjectiveTypeSingle {
    id: number;
    languages: ObjectiveTypeLanguage[];
    
}
export interface ObjectiveTypeLanguage{
    id:number;
    objective_type:ObjectiveTypeSingleLanguage[]
}
export interface ObjectiveTypeSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}