

export interface MockDrillChecks {
    mock_drill_response_service_id: any;
    id: number;
    question: string;
    answer: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface MockDrillChecksPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillChecks[];
}
export interface MockDrillChecksSingle {
    id: number;
    question: string;
    answer: string;
}