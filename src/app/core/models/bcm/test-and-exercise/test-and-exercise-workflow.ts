export interface TestAndExercisesWorkflowDetail{
    test_and_exercise_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

export interface TestAndExercisesWorkflowHistory{
    id:number;
}

export interface TestAndExercisesWorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TestAndExercisesWorkflowHistory[];
}