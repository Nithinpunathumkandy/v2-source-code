export interface CompetencyGroup {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface CompetencyGroupPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: CompetencyGroup[];
}