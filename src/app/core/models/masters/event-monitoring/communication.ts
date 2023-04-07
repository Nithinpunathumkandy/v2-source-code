export interface Communication {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface CommunicationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Communication[];
}
export interface CommunicationSingle {
    id: number;
    languages: CommunicationLanguage[];
    
}
export interface CommunicationLanguage{
    id:number;
    communication:CommunicationSingleLanguage[]
}
export interface CommunicationSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}