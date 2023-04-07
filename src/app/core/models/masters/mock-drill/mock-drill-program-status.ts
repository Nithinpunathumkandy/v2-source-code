export interface MockDrillProgramStatus {
    id: number,
    mock_drill_program_status_language_title: string,
    type: string;
    status_id: number,
    status_label: string,
    status: string,
}
export interface MockDrillProgramStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillProgramStatus[];
}
export interface MockDrillProgramStatusSingle {
    id: number;
    languages: MockDrillProgramStatusSingleLanguage[];
}
export interface MockDrillProgramStatusSingleLanguage {
    language_id: number;
    title: string;
    pivot: {
        mock_drill_status_id: number,
        language_id: number,
        title: string
    }
}
