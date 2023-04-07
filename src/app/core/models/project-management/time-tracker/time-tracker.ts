export interface TimeTrackerPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TimeTracker[];
}

export interface ProjectTimeTrackerPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectTimeTracker[];
}

export interface ProjectTimeTracker{
    resource_first_name:string;
    resource_last_name:string;
    total_days:string;
    hours:string;
    resource_image_token:string;
    created_by:number;
    project_time_tracker_activity_title:string;
    created_by_department:string;
    created_by_designation:string;
    created_by_first_name:string;
    created_by_image_token:string;
    created_by_last_name:string;
    created_by_mobile:string;
    comment:string;
    date:string;
    created_by_status_id:number

}

export interface IndividualTimeTrackerDetails {
    by_activities: Activities[];
    by_users: Users[];
    project_time:ProjectTime[];
}

export interface Activities
{
    activities:string;
    count:number;
    id:number;
    percentage:number;
}

export interface Users{
    resource_first_name:string;
    resource_last_name:string;
    total_days:string;
    resource_image_token:string;
    created_by:number;
    project_time_tracker_activity_title:string;
    created_by_department:string;
    created_by_designation:string;
    created_by_first_name:string;
    created_by_image_token:string;
    created_by_last_name:string;
    created_by_mobile:string;
    comment:string;
    created_by_status_id:number

}
export interface ProjectTime
{
    project_time:string;
}

export interface TimeTrackerActivityPaginationResponse {
    data: TimeTrackerActivity[];
}

export interface TimeTrackerActivity{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    reference_code: string;
    project_time_tracker_activity_language_title: string;
}

export interface TimeTracker{
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    description: string;
    end_date: string;
    id: number;
    reference_code: string;
    start_date: string;
    title: string;
}