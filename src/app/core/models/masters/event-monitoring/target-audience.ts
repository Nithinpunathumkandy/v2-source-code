export interface TargetAudience {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface TargetAudiencePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TargetAudience[];
}
export interface TargetAudienceSingle {
    id: number;
    languages: TargetAudienceLanguage[];
    
}
export interface TargetAudienceLanguage{
    id:number;
    target_audience:TargetAudienceSingleLanguage[]
}
export interface TargetAudienceSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}