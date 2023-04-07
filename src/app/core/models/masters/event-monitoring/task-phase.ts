export interface TaskPhase{
    id:number;
    title:string;
    description: string;
    status_id :number;
}
export interface TaskPhasePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TaskPhase[];
}