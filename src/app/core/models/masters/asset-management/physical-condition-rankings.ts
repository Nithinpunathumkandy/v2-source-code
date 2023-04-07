export interface PhysicalConditionRankings {
    id: number;
    title:string;
    status: string;
    status_id :number;
    status_label: string;
    type:string;
}

export interface PhysicalConditionRankingsPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: PhysicalConditionRankings[];
}
