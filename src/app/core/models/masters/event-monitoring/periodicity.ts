export interface Periodicity {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface PeriodicityPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Periodicity[];
}
export interface PeriodicitySingle {
    id: number;
    languages: PeriodicityLanguage[];
    
}
export interface PeriodicityLanguage{
    id:number;
    periodicity:PeriodicitySingleLanguage[]
}
export interface PeriodicitySingleLanguage{
    description: string;
    language_id: number;
    title: string;
}