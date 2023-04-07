export interface BusinessAssessmentStatus{

}

export interface BusinessAssessmentStatusPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BusinessAssessmentStatus[];
}