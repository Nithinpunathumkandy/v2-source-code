import { NumberLiteralType } from 'typescript';
import { CreatedBy } from '../../general/created_by';
import { UpdatedBy } from '../../general/updated_by';

export interface MockDrill {
    id: number;
    mock_drill_type: string;
    venue: string;
    date: Date;
    resposibility: string;
    status: string;
}
export interface Participants {
    user_id: number;
    participant_id: number;
    name: string;
    designation: string;
    evacuation_time: string;
    image_token: string;
    is_delete: boolean;
    is_new: boolean;
    is_exist: boolean;
}
export interface ResponseServiceChecks {
    mock_drill_check_id: number;
    mock_drill_response_service_check_id: number;
    service_id: number;
    question: string;
    answer: string;
}
export interface MockDrillPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrill[];
}

export interface IndividualMockDrill {
    id: number;
    actual_date: Date;
    start_time: string;
    end_time: string;
    incident_controller: any;
    mock_drill_checks: any;
    scenario: any;
    mock_drill_observations: any;
    mock_drill_participants: any;
    next_review_user_level: any;
    mock_drill_plan: any;
    mock_drill_reports: any;
    no_of_participants: number;
    no_of_premises: number;
    created_at: string;
    updated_at: string;
    created_by: CreatedBy;
    updated_by: UpdatedBy[];
    submitted_by: any
    work_flow_items: any
}

export interface MockDrillGeneralSettings {

    is_info: boolean;
    is_assembly_check_point: boolean;
    is_participants: boolean;
    is_observation: boolean;
    is_preview: boolean;

}
export interface MockDrillHistory {
    comment: string;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    id: number;
    level: null
    reviewed_user_designation: string;
    reviewed_user_designation_id: number;
    reviewed_user_first_name: string;
    reviewed_user_image_token: string;
    reviewed_user_last_name: string;
    updated_at: string;
    updated_by: string;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: string;
    updated_by_last_name: string;
    updated_by_status: string;
    workflow_status_id: number;
    workflow_status_title: string;
}