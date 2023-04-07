export interface RiskMatrixCalculationMethod {
    id: number;
    risk_matrix_calculation_method_title: string;
    status: string;
    status_id :number;
    is_selected:boolean;
    status_label: string;
    is_addition: boolean;
    is_multiplication: boolean;
}

export interface RiskMatrixCalculationMethodPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskMatrixCalculationMethod[];
}