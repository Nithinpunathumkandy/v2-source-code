
export interface ProjectTasks {
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
    description:  string;
    designation:  string;
    estimated_hours:  string;
    id: number;
    parent_task_id: null
    parent_task_title: null
    percentage: number;
    responsible_user_first_name:  string;
    responsible_user_id: number;
    responsible_user_image_token: null
    responsible_user_last_name:  string;
    start_date:  string;
    status:  string;
    status_id: number;
    target_date:  string;
    task_category_id: number;
    task_category_title:  string;
    task_priority_id: number;
    task_priority_title:  string;
    title:  string;
    updated_at: string;
    updated_by: number;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: null
    updated_by_last_name: string;
    updated_by_status: string;
}

export interface ProjectTasksPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectTasks[];
}

export interface IndividualProjectTasks {
    created_at: string;
    created_by;
    id: number;
    project;
    target_date;
    updated_at: string;
    updated_by;
    description: string;
    documents: []
    estimated_hours: string;
    parent_task: null
    percentage: number;
    responsible_user;
    start_date: string;
    task_category: []
    task_checklists: []
    task_expenses: []
    task_priority: []
    task_status;
    task_tags: []
    task_time_entries: []
    task_watchers;
    title: string;


   

}


