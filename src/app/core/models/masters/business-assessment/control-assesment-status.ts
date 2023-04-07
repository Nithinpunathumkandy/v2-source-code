export interface ControlAssessmentStatus{
  id:number;
  title:string
}

export interface ControlAssessmentStatusPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ControlAssessmentStatus[];
}