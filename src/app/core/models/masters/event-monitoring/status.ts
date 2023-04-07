export interface Status {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    type: string;
}

export interface StatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Status[];
}
export interface StatusSingle {
    id: number;
    languages: StatusLanguage[];
    
}
export interface StatusLanguage{
    id:number;
    status:StatusSingleLanguage[]
}
export interface StatusSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}