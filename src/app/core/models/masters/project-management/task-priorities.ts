export interface TaskPriorities {
    id: number;
    title: string;
    description:string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface TaskPrioritiesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: TaskPriorities[];
}