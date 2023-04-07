import { CreatedBy } from "../../human-capital/users/user-document";
import { User } from "../../knowledge-hub/documents/documentDetails";
import { Languages } from "../../masters/general/label";
import { RiskRating } from "../../masters/risk-management/risk-rating";
import { Impact } from "../hira-configuration/impact";
import { Likelihood } from "../hira-configuration/likelihood";
import { Control, Process } from "./hira-assessment";
import { Risk } from "./hira";

export interface RiskTreatment {
    risk_id: any;
    type: string;
    watcher_id: any;
    risk_responsible_user_id: any;
    risk_owner_id: any;
    title: string;
    id: number;
    reference_code: string;
    risk_treatment_status_title: string;
    responsible_user_designation: string;
    responsible_user_first_name: string;
    responsible_user_id: any;
    responsible_user_image_token: string;
    responsible_user_last_name: string;
}

export interface RiskTreatmentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskTreatment[];
}

export interface IndividualRiskTreatment {
    treatment_dependency: any;
    responsible_user_id: any;
    risk_owner_id: any;
    comment: string;
    risk_id: any;
    id: number;
    reference_code: string;
    title: string;
    budget: number;
    days_remaining: number;
    start_date: string;
    target_date: string;
    created_at: string;
    process_details: TreatmentProcess[];
    responsible_user: User;
    watchers: User[];
    risk_treatment_status: Status;
    description: string;
    created_by: CreatedBy;
    completed_percentage: number;
    percentage: number;
    budget_vs_used_percentage: number;
    amount_used: any;
    total_days: number;
    risk:Risk;
    risk_treatment_comment:Comment[];
    latest_risk_treatment_update:any;

}
export interface TreatmentProcess {
    new_controls: NewControl[];
    existing_controls: NewControl[];
    process: Process
}

export interface Status {
    id: number;
    type: string;
    language:Languages[];
}

export interface NewControl {
    control: Control;
    control_id: number;
    id: number;
}

export interface RiskSummary {
    completed_percentage: number;
    closed_count: number;
    total_count: number;
}

export interface HistoryData {
   data:History[];
   current_page: number;
    total: number;
    per_page: number;
    last_page: number;
}

export interface History{
    id: number;
    treatment_title: string;
    percentage: number;
    amount_used: string;
    created_at: string
    created_by: number
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string
    created_by_status: string;
    risk_treatment_status_id: number
    risk_treatment_status_title: string;
    updated_at: string;
    documents:Document[];
    label:string;

}

export interface Document {
    id: number;
    name: string;
    ext: string;
    mime_type: string;
    size: number;
    url: string;
    thumbnail_url: string;
    token: string;
    title:string;
    risk_treatment_update_id:number;
  }

  export interface Comment{
    id: number;
    message:string;
    risk_treatment_id: number;
  }