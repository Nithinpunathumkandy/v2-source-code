export interface ReportFrequency {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface ReportFrequencyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ReportFrequency[];
}