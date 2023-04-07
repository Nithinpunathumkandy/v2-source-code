export interface AmAnnualPlanStatus {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface AmAnnualPlanStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmAnnualPlanStatus[];
}