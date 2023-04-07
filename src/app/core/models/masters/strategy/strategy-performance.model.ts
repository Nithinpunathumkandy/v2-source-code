export interface StrategyPerformances {
    id: number;
    status: string;
    status_id :number;
    status_label: string;
    title:string;
    description:string;
}

export interface StrategyPerformancesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyPerformances[];
}