import { string } from "@amcharts/amcharts4/core";

export interface SelfAssessmentStatus {
    id: number;
    title: string;
    type: string;
    status: string;
    status_id :number;
    status_label: string;
    label: string;
    color_code: string;
}
export interface SelfAssessmentStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SelfAssessmentStatus[];
}