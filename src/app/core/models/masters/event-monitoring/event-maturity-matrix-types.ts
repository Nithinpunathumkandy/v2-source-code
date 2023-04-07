export interface EventMatrixType {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface EventMatrixTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventMatrixType[];
}
export interface EventMatrixTypeSingle {
    id: number;
    languages: EventMatrixTypeLanguage[];
    
}
export interface EventMatrixTypeLanguage{
    id:number;
    event_matrix_type:EventMatrixTypeSingleLanguage[]
}
export interface EventMatrixTypeSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}