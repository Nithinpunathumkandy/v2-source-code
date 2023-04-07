export interface TestAndExerciseTypes{
    id:number;
    title:string;
    status_id :number;
}
export interface TestAndExerciseTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TestAndExerciseTypes[];
}