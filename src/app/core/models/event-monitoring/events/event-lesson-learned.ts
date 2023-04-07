export interface EventLessonLearned {
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    description:string
    duration:number
    end_date:string
    id:number
    percentage:string
    reference_code:string
    start_date:string
    task_phase_title:string
    title:string
}

export interface EventLessonLearnedPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventLessonLearned[];
}
 export interface EventLessonLearnedDetails{
     created_at
     created_by
     description:string
     recommendation:string
     is_further_action_required:number
     duration:number
     end_date:string
     id:number
     percentage:string
     reference_code:string
     responsible_users
     start_date:string
     sub_tasks
     title:string     
 }