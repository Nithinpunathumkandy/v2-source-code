export interface EventEngagementStrategy {
    id: number;
    title: string;
    event_engagement_strategy_title:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface EventEngagementStrategyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventEngagementStrategy[];
}
export interface EventEngagementStrategySingle {
    id: number;
    languages: EventEngagementStrategyLanguage[];
    
}
export interface EventEngagementStrategyLanguage{
    id:number;
    event_type:EventEngagementStrategySingleLanguage[]
}
export interface EventEngagementStrategySingleLanguage{
    description: string;
    language_id: number;
    title: string;
}
