import { CreatedBy } from "../../general/created_by";
import { Department } from "../../general/department";
import { Division } from "../../general/division";
import { RiskRating } from "../../masters/external-audit/risk-rating";
import { RiskArea } from "../../masters/risk-management/risk-area";
import { RiskCategory } from "../../masters/risk-management/risk-category";
import { RiskTreatmentStatuses } from "../../masters/risk-management/risk-treatment-statuses";
import { User } from "../../user.model";
import { Likelihood } from "../risk-configuration/likelihood";
import { RiskStatus } from "../risks/risks";

export interface ErmReportList {
    id: number;
    department: Department;
    department_id: number;
    division: Division;
    division_id: number;
    end_date: string;
    reference_code: string;
    start_date: string
}

export interface IndividualErmDetail {
    created_at: CreatedBy;
    created_by: CreatedBy;
    department: Department;
    detailed_erm_report_risks: ErmDetailedrisk[];
    division: Division;
    end_date: string;
    id: number;
    reference_code: string;
    start_date: string;
}

export interface ErmDetailedrisk { 
    created_by: CreatedBy;
    description: string
    detailed_erm_report_id: number;
    detailed_erm_report_risk_causes: string[]
    detailed_erm_report_risk_impacts: string[]
    detailed_erm_report_risk_treatments: riskTreatment[]
    id: number;
    observation: string;
    risk_areas: RiskArea[];
    risk_category: RiskCategory;
    risk_category_id: number;
    risk_id: number;
    risk_matrix_likelihood: Likelihood;
    risk_matrix_likelihood_id: number;
    risk_matrix_impact_id: number,
    risk_owner: User;
    risk_owner_id: 1
    risk_rating: RiskRating;
    risk_rating_id: 2
    risk_reference_code: "DD000010"
    risk_status: RiskStatus;
    risk_status_id: number;
    score: string;
    title: string;
}
export interface riskTreatment { 
    id: number;
    created_by: CreatedBy;
    description: string;
    dependency: string;
    detailed_erm_report_id: number;
    detailed_erm_report_risk_id: number;
    responsible_user: User;
    responsible_user_id: number;
    risk_id: number;
    risk_treatment_status: RiskTreatmentStatuses;
    risk_treatment_status_id: number;
    score: string;
    target_date: string;
    title: string;
    risk_areas: RiskArea[];
}

export interface ErmDetailsReportsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ErmReportList[];
}
