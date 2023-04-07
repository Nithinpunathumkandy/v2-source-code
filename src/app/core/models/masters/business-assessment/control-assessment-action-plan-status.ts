export interface ControlAssessmentActionPlanStatus{

}

export interface ControlAssessmentActionPlanStatusPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ControlAssessmentActionPlanStatus[];
}