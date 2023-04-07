export interface StrategyInitiativeReviewFrequency {
    id: number;
    type: string;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface StrategyInitiativeReviewFrequencyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyInitiativeReviewFrequency[];
}