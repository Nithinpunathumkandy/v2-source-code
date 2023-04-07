export interface TestAndExerciseStatuses {
    color_code: string;
    id: number;
    label: string;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
}
export interface TestAndExerciseStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TestAndExerciseStatuses[];
}