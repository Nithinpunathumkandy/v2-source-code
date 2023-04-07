export interface MockDrillStatus {
    id: number,
    title: string,
    status_id: number,
    status_label: string,
    status: string,
}
export interface MockDrillStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillStatus[];
}
export interface MockDrillStatusSingle {
    id: number;
    languages: MockDrillStatusSingleLanguage[];
}
export interface MockDrillStatusSingleLanguage {
    language_id: number;
    title: string;
    pivot: {
        mock_drill_status_id: number,
        language_id: number,
        title: string
    }
}
