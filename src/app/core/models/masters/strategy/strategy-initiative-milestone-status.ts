export interface StrategyInitiativeMilestoneStatus{
    id:number;
    title:string;
    type: string;
    status_id :number;
   
}
export interface StrategyInitiativeMilestoneStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyInitiativeMilestoneStatus[];
}