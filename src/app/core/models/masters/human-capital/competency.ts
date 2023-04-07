export interface Competency {
    id: number;
    title: string;
    competency_group:string;
    competency_group_id: number;
    competency_type_id: number;
    status: string;
    status_id: number;
    status_label: string;
    description: string;
}

export interface CompetencyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Competency[];
}