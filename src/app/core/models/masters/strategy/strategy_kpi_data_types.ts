export interface StrategyKpiDataTypes {
    id: number;
    status: string;
    status_id :number;
    status_label: string;
    type:string;
}

export interface StrategyKpiDataTypesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: StrategyKpiDataTypes[];
}
