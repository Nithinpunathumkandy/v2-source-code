export interface RiskTreatmentStatuses {
    type: string;
    id: number;
    risk_type_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
    risk_treatment_status_language_title: string;
}

export interface RiskTreatmentStatusesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskTreatmentStatuses[];
}