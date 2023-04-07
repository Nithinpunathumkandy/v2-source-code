export interface EventTask {
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    description:string;
    duration:number;
    end_date:string;
    id:number;
    percentage:string;
    event_task_reference_code:string;
    reference_code: string;
    start_date:string;
    task_phase_title:string;
    title:string;
}

export interface EventTaskPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventTask[];
}
 export interface EventTaskDetails{
     created_at
     created_by
     description:string
     duration:number
     documents:Documents[];
     event_task_id:number
     end_date:string
     id:number
     percentage:string
     reference_code:string
     responsible_users     
     start_date:string
     sub_tasks:EventTaskDetails[]
     title:string
     task_phase:any     
     event_task_status:any
     task_phase_title
     event:event[]
     task_phase_id:number
 }

 export interface event{
     reference_code:string
     reference_id;
     title:string
     description:string
 }

 export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
}

export interface HistoryPaginationData{
    data:HistoryData[]
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number
    comment:string;
}

export interface HistoryData{
    created_at:string;
    created_by:number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    lesson_learnt_corrective_action_status_id: number;
    lesson_learnt_corrective_action_status_title: string;
    id: number;
    comment: string;
    documents;
    percentage: number;
    treatment_title: string;
    updated_at: string;
    updated_by: string;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: string;
    updated_by_last_name: string;
    updated_by_status: string;
}