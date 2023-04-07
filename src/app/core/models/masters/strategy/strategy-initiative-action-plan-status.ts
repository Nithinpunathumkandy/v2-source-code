export interface StrategyInitiativeActionPlanStatus {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface StrategyInitiativeActionPlanStatusPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: StrategyInitiativeActionPlanStatus[];
}