export interface ActionPlan{
    id
    title
    count
    code
    color
    meeting_action_plan_total_count
    meeting_action_plan_open_count
    meeting_action_plan_closed_count
    meeting_action_plan_wip_count
    meeting_action_plan_resolved_count
    meeting_action_plan_rejected_count
}

export interface MeetingYear{
    year
    count
}

export interface MeetingVsActionPlan{
    month
    month_num
    total_meeting_action_count
    total_meeting_count
    year
}

export interface MRMCounts{
    closed_meeting_action_plan_count
    meeting_action_plan_count
    meeting_count
    mrm_plans_count
    open_meeting_action_plan_count
    upcoming_meeting_count
}