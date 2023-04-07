export interface StrategyObjectiveTypes {
    id: number;
    status: string;
    status_id :number;
    status_label: string;
    type:string;
    title:string;
    description:string;
    child_objective_type:[];
    designation_level_id:number;
    designation_level_order:number;
    designation_level_title:string;
}

export interface StrategyObjectiveTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyObjectiveTypes[];
}