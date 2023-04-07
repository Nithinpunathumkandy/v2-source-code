import { LanguagePivot } from "../general/label";

export interface BusinessContinuityPlanStatus {
    id: number;
    type: string;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface BusinessContinuityPlanStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BusinessContinuityPlanStatus[];
}

export interface BusinessContinuityPlanStatusDetails{
    color_code: string;
    id: number;
    label: string;
    status_id: number;
    language: BusinessContinuityPlanStatusLanguage[];
    type: string;
}

export interface BusinessContinuityPlanStatusLanguage{
    code: string;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {
        business_continuity_plan_status_id: number;
        language_id: number;
        title: string;
    }
    status_id: number;
    title: string;
    type: string;
}