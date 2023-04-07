export interface TestAndExerciseChecklist{
    id:number;
    title:string;
    description: string;
    status_id :number;
    answer
    remarks
}
export interface TestAndExerciseChecklistPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TestAndExerciseChecklist[];
}