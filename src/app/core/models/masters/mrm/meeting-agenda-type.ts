export interface MeetingAgendaType {
    id: number;
    status: string;
    status_id :number;
    status_label: string;
    meeting_action_plan_status_language_title: string;
    type: string;
    title:string;
}

export interface MeetingAgendaTypePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: MeetingAgendaType[];
}