
import { CreatedBy } from "../../bpm/process/activity";
import { ResponsibleUser } from "../../customer-satisfaction/customer-complaint-action-plans/customer-complaint-action-plans";
import { UpdatedBy } from "../../general/updated_by";
import { Language } from "../../internal-audit/audit-program/audit-program";


export interface MockDrillActionPlans {
    created_at: string,
    created_by: CreatedBy,
    created_by_department: string,
    created_by_designation: string,
    created_by_first_name: string,
    created_by_image_token: string,
    created_by_last_name: string,
    created_by_status: string,
    description: string,
    id: number,
    mock_drill_action_plan_status_label: string,
    mock_drill_action_plan_status_language_title: string,
    mock_drill_action_plan_statuses_id: string,
    mock_drill_actual_date: string,
    mock_drill_end_time: string,
    mock_drill_id: number,
    mock_drill_plan_id: number,
    mock_drill_start_time: string,
    next_review_user_level: string,
    reference_code: string,
    responsible_user_designation_id: number,
    responsible_user_designation_title: string,
    responsible_user_first_name: string,
    responsible_user_image_token: string,
    responsible_user_last_name: string,
    start_date: string,
    target_date: string,
    title: string,
    updated_at: string,
    updated_by: string,
    updated_by_department: string,
    updated_by_designation: string,
    updated_by_first_name: string,
    updated_by_image_token: string,
    updated_by_last_name: string,
    updated_by_status: string,
    venue: string;
}
export interface MockDrillActionPlanStatus {

    id: number;
    type: string;
    label: string;
    language: Language;
    created_by: CreatedBy
}

export interface MockDrillActionPlanDetails {
    completion: string,
    count_down: any;
    created_at: string,
    created_by: CreatedBy,
    description: string,
    documents: any,
    id: number,
    mock_drill: any;
    mock_drill_action_plan_status: any;
    reference_code: string,
    responsible_user: any,
    start_date: string,
    target_date: string,
    title: string,
    updated_at: string,
    updated_by: UpdatedBy,
}

export interface MockDrillDocumentContentChecklst {
    id: number;
    checklist_id: number;
}

export interface MockDrillActionPlanPaginationResponse {
    current_page: number;
    per_page: number;
    total: number;
    from: number;
    data: MockDrillActionPlans[];
}

export interface HistoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: History[];
}

export interface History {
    id: number;
    comment: string;
    percentage: number;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    updated_at: string;
    mock_drill_action_plan_status_title: string;
    mock_drill_action_plan_status_id: number;
    mock_drill_action_plan_title: string;
    mock_drill_action_plan_status_label: string;
    documents: Document[];
    label: string;
}




