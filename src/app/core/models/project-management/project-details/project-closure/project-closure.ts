
export interface ProjectClosure {
    budget: string;
    color_code: string;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: null
    created_by_last_name: string;
    created_by_status: string;
    id: number;
    label: string;
    project_id: number;
    project_monitor_closure_status_id: number;
    project_monitor_closure_status_title: string;
    project_output_quality: string;
    project_schedule: string;
    project_title: string;
    scope_of_work: string;
    type: string;
    updated_at: string;
    updated_by: number;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: null
    updated_by_last_name: string;
    updated_by_status: string;
}

export interface ProjectClosurePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectClosure[];
}

export interface IndividualProjectClosure {
    budget: string;
    created_at: string;
    created_by;
    id: number;
    project;
    project_monitor_closure_status;
    project_output_quality: string;
    project_schedule: string;
    scope_of_work: string;
    updated_at: string;
    updated_by;
    next_review_user_level;
    workflow_items;
    submitted_by;
}


