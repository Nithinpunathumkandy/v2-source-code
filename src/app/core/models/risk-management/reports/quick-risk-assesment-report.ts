import { CreatedBy } from "../../general/created_by";
import { Department } from "../../general/department";
import { Division } from "../../general/division";
import { RiskRating } from "../../masters/external-audit/risk-rating";
import { RiskArea } from "../../masters/risk-management/risk-area";
import { RiskCategory } from "../../masters/risk-management/risk-category";
import { User } from "../../user.model";
import { Impact } from "../risk-configuration/impact";
import { Likelihood } from "../risk-configuration/likelihood";


export interface QuickRiskReportList {
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: null
    created_by_last_name: string;
    created_by_status: string;
    date: string;
    department: string;
    department_id: number;
    division: string;
    division_id: number;
    id: number;
    reference_code: string;

}


export interface IndividualQuickRiskDetail {
    created_at: string;
    created_by: CreatedBy;
    date: string;
    department: Department;
    division: Division;
    id: number;
    quick_risk_assessment_report_details: QuickRiskReportDetail[]
    quick_risk_assessment_report_items: QuickRiskItems[]
    quick_risk_assessment_report_risks: QuickSummaryReport[]
    reference_code: string;
    
}

export interface QuickRiskReportDetail {
    created_at: string;
    created_by: number
    description: string;
    id: number;
    order: number;
    quick_risk_assessment_report_id: number;
    title: string
}

export interface QuickRiskItems {
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    order: number;
    quick_risk_assessment_report_id: number;
    title: string;
    type: string;
}

export interface QuickSummaryReport {
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    quick_risk_assessment_report_id: number;
    quick_risk_assessment_report_risk_observation: RiskObservation;
    quick_risk_assessment_report_risk_treatments: RiskTreatment;
    risk_category: RiskCategory;
    risk_category_id: number;
    risk_owner: User;
    risk_owner_id: number;
    risk_score: number
    title: string;
}

export interface RiskObservation {
    created_at: string;
    created_by: number;
    id: number;
    observation: string;
    quick_risk_assessment_report_id: number;
    quick_risk_assessment_report_risk_id: number;
    risk_areas: RiskArea;
    risk_causes: string[]
    risk_impacts: string[]
    risk_matrix_impact: Impact;
    risk_matrix_impact_id: number;
    risk_matrix_likelihood: Likelihood;
    risk_matrix_likelihood_id: number;
    risk_rating: RiskRating;
    risk_rating_id: number;
    risk_score: number;
}

export interface RiskTreatment {
    created_at: string;
    created_by: number;
    id: number;
    quick_risk_assessment_report_id: number;
    quick_risk_assessment_report_risk_id: number;
    risk_treatment_owner: User;
    risk_treatment_owner_id: number;
    score: string;
    target_date: string;
    title: string;
}
export interface QuickRiskReportsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: QuickRiskReportList[];
}

