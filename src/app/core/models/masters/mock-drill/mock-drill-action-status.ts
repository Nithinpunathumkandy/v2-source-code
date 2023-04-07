export interface MockDrillActionStatus {
    id: number,
    title: string,
    status_id: number,
    status_label: string,
    status: string,
}
export interface MockDrillActionStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillActionStatus[];
}
export interface MockDrillActionStatusSingle {
    id: number;
    languages: MockDrillActionStatusSingleLanguage[];
}
export interface MockDrillActionStatusSingleLanguage {
    language_id: number;
    title: string;
    pivot: {
        mock_drill_action_status_id: number,
        language_id: number,
        title: string
    }
}
