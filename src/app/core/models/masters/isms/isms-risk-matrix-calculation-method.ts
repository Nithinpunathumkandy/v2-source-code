export interface IsmsRiskMatrixCalculationMethod {
    is_selected: any;
    label: any;
    id: number;
    title: string;
    type: string;
    status: string;
    status_id: number;
    status_label: string;
    description: string;
}

export interface IsmsRiskMatrixCalculationMethodPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IsmsRiskMatrixCalculationMethod[];
}