export interface MsAditScheduleStatuses {
    id: number;
    title: string;
    label:string;
    color_code:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface MsAditScheduleStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAditScheduleStatuses[];
}