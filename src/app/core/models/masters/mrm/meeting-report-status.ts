export interface MeetingReportStatus {
    id: number;
    title: string;
    description:string;
    status: string;
    status_id :number;
    status_label: string;
    meeting_report_status_language_title: string;
    type: string;

}

export interface MeetingReportStatusPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: MeetingReportStatus[];
}