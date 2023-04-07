export interface MeetingPlanStatus {
    id: number;
    meeting_plan_status_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface MeetingPlanStatusPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: MeetingPlanStatus[];
}
