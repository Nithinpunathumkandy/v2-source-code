export interface EventStatuses{
    id:number
    title:string
    count:number
    percentage:number
    department_amount:string
    type: string
}

export interface TaskCount{
    task_count:number
    close_task_count:number
    open_task_count:number
    open_task_count_percentage:string
    close_task_count_percentage:string
    approved_events:number
    cancelled_events:number
    closed_events:number
    draft_events:number
    in_review_events:number
    new_events:number
    on_going_events:number
    over_due_events:number
    postponed_events:number
    rejected_events:number
    send_back_events:number
    total_event_change_requests:number
    total_event_closures:number
    total_events:number
}

export interface MilestoneMonth{
    completed_milestones:number
    delayed_milestones:number
    month:string
    new_milestones:number
    total_count:number
}

export interface EventBudgetByYears{
    year:number
    year_amount:string
}