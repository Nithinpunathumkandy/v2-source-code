export interface MockDrillActionPlanStatus {
    id: number;
    status: string;
    status_id: number;
    status_label: string;
    mock_drill_action_plan_status_language_title: string;
    type: string;

}

export interface MockDrillActionPlanStatusPaginationResponse {
    current_page: number;
    from: number;
    total: number;
    per_page: number;
    last_page: number;
    data: MockDrillActionPlanStatus[];
}