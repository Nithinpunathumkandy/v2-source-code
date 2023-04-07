
export interface ProjectManagers {
    customer_id: number;
    description: string;
    id: number;
    image_ext;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    is_pinned: number;
    is_system_project: number;
    location_id: number;
    member_count;
    milestone_progress: string;
    next_review_user_level: number;
    project_category_id: number;
    project_contract_type_id: number;
    project_id: number;
    project_manager: ProjectManager;
    project_manager_id: number;
    project_monitoring_status_id: number;
    project_priority_id: number;
    project_status_id: number;
    project_type_id: number;
    reference_code: string;
    reference_id: number;
    start_date: string;
    submitted_by: number;
    target_date: string;
    title: string;
    updated_at: string;
    updated_by;
}

export interface ProjectMembers {
    customer_id: number;
    description: string;
    id: number;
    image_ext;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    is_pinned: number;
    is_system_project: number;
    location_id: number;
    member_count;
    milestone_progress: string;
    next_review_user_level: number;
    project_category_id: number;
    project_contract_type_id: number;
    project_id: number;
    project_manager_id: number;
    project_monitoring_status_id: number;
    project_priority_id: number;
    project_status_id: number;
    project_type_id: number;
    reference_code: string;
    reference_id: number;
    start_date: string;
    submitted_by: number;
    target_date: string;
    title: string;
    updated_at: string;
    updated_by;
    project_members: any;
}

export interface ProjectAssistantManagers {
    customer_id: number;
    description: string;
    id: number;
    image_ext;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    is_pinned: number;
    is_system_project: number;
    location_id: number;
    member_count;
    milestone_progress: string;
    next_review_user_level: number;
    project_category_id: number;
    project_contract_type_id: number;
    project_id: number;
    project_assistant_managers:any;
    project_manager_id: number;
    project_monitoring_status_id: number;
    project_priority_id: number;
    project_status_id: number;
    project_type_id: number;
    reference_code: string;
    reference_id: number;
    start_date: string;
    submitted_by: number;
    target_date: string;
    title: string;
    updated_at: string;
    updated_by;
}


export interface ProjectManager {
    assessment_date;
    assessment_date_previous;
    assessment_score;
    assessment_score_previous;
    branch_id: number;
    created_at: string;
    created_by: number;
    department_id: number;
    designation;
    designation_id: 2
    division_id: 1
    email: string;
    first_name: string;
    id: number;
    image_ext;
    image_size;
    image_title: string;
    image_token;
    image_url: string;
    is_auditor: number;
    is_first_login: number;
    is_include_in_oc: number;
    is_top_user: number;
    last_name: string;
    login_attempts: number;
    login_blocked_at;
    login_enabled: number;
    mobile;
    organization_id: number;
    password_reset_token;
    password_reset_token_expiry;
    password_updated_at: string;
    personal_email: null
    section_id: number;
    status_id: number;
    sub_section_id: number;
    updated_at: string;
    updated_by: number;
    user_id: number;
}