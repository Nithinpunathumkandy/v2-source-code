export interface StrategyInitiativeActions {
    id: number;
    description: string;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface StrategyInitiativeActionsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyInitiativeActions[];
}