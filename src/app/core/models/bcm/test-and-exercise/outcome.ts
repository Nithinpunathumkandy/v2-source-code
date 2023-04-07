import { Languages } from "../../masters/general/label";

export interface OutcomePaginationResponse {
    current_page: number;
    per_page: number;
    total: number;
    data: Outcome[];
}

export interface Outcome {
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

export interface IndividualOutcome {
    actual_cost: string
    checklists: checkList[]
    created_at: string
    created_by: CreatedBy
    documents: Documents[]
    id: number
    improvements: string
    recovery_level: {
        id: number
        status_id: number
        title: string,
        description:string
    }
    recovery_time: string
    remarks: string
    test_and_exercise: {
        communications: string
        created_at: string
        created_by: number
        end_date: string
        id: number
        reference_code: string
        remarks: string
        scope: string
        start_date: string
        test_and_exercise_status_id: number
        title: string
        type_id: number
    }
    test_and_exercise_id: number
    updated_at: string
    what_went_well: string
}

export interface checkList {
    answer: number
    checklist_answer_id: number
    comments: string
    laravel_through_key: number
    test_and_exercise_checklist_id: number
    test_and_exercise_outcome_id: number
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
