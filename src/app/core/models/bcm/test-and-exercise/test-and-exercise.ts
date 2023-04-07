import { Languages } from "../../masters/general/label";

export interface TestAndExercisePaginationResponse {
    current_page: number;
    per_page: number;
    total: number;
    last_page:number
    from:number
    data: TestAndExercise[];
}

export interface TestAndExercise {
    bcp_titles: string
    created_at: string
    created_by: number
    created_by_department: string
    created_by_designation: string
    created_by_first_name: string
    created_by_image_token: null
    created_by_last_name: string
    created_by_status: string
    end_date: string
    id: number
    label: string
    reference_code: string
    start_date: string
    test_and_exercise_leader_designation: any
    test_and_exercise_leader_designation_id: any
    test_and_exercise_leader_first_name: any
    test_and_exercise_leader_image_ext: any
    test_and_exercise_leader_image_size: any
    test_and_exercise_leader_image_title: any
    test_and_exercise_leader_image_token: any
    test_and_exercise_leader_image_url: any
    test_and_exercise_leader_last_name: any
    test_and_exercise_status_id: number
    test_and_exercise_status_title: string
    test_and_exercise_type_title: string
}

export interface IndividualTestAndExercise {
    bcp_call_trees: any
    business_continuity_plan_strategy_solutions: business_continuity_plan_strategy_solutions[]
    business_continuity_plans: business_continuity_plans[]
    communications: string
    created_at: string
    created_by: CreatedBy
    documents: Documents[]
    end_date: string
    exercise_leads: any
    id: number
    plan_communications: any
    reference_code: string
    remarks: string
    risks: [
        {
            id: number
            title: string
        }
    ]
    next_review_user_level;
    outcome;
    submitted_by;
    workflow_items;
    scope: string
    start_date: string
    test_and_exercise_status: {
        color_code: string
        id: number
        label: string
        status_id: number
        type: string
        languages:Languages[]
    }
    test_and_exercise_type:{
        id:number
        title:string
    }
    title: string
    updated_at: string
    updated_by: any
}

export interface SolutionsPaginationResponse {
    current_page: number;
    per_page: number;
    total: number;
    data: Solutions[];
}

export interface Solutions {
    id: number
    title: string
}

export interface ScenarioPaginationResponse {
    current_page: number;
    per_page: number;
    total: number;
    data: Scenario[];
}

export interface Scenario {
    id: number
    title: string
}

export interface business_continuity_plan_strategy_solutions{
    id:number
    title:string
    reference_code:string
    business_continuity_strategy_id
}

export interface business_continuity_plans{
    id:number
    title:string
    reference_code:string
    business_continuity_plan_status_id
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at: string;
    created_by: number;
    thumbnail_url: string;
    updated_at: string;
    updated_by: string;
    user_job_id: string;
}

export interface CreatedBy {
    designation: string,
    first_name: string,
    last_name: string,
    image: Image
}

export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}

export interface TestExerciseActionPlanPagination{
    current_page: number;
    per_page: number;
    total: number;
    last_page:number
    from:number
    data: any;
}