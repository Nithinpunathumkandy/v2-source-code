export interface TestAndExerciseActionPlanStatus{
    id:number;
    title:string;
    status_id :number;
    status_label: string,
    status: string,
}

export interface TestAndExerciseActionPlanStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TestAndExerciseActionPlanStatus[];
}