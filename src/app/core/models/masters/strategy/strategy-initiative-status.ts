export interface StrategyInitiativeStatus {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface StrategyInitiativeStatusPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: StrategyInitiativeStatus[];
}