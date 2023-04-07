export interface TimeTrackerReport {
    id: number;
    title: string;
    type: string;
    project: string;
    resource: string;
    total_days: number;
}
export interface TimeTrackerReportPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: TimeTrackerReport[];
}