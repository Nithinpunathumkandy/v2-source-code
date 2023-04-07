import { CreatedBy } from '../../general/created_by';
import { UpdatedBy } from '../../general/updated_by';

export interface MockDrillPlan {
    id: number;
    preplan_id: number;
    mock_drill_type: string;
    venue: string;
    date: Date;
    resposibility: string;
    status: string;
}

export interface MockDrillPlanPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillPlan[];
}

export interface IndividualMockDrillPlan {
    id: number;
    preplan_id: number;
    mock_drill_type_id: number;
    leader_id: number;
    date: Date;
    venue: string;
    evacuation_teams: EvacuationTeams[];
    mock_drill_stakeholders: any;
    created_at: string,
    updated_at: string,
    created_by: CreatedBy
    updated_by: UpdatedBy[]
}

export interface EvacuationTeams {
    user_id: number;
    mock_drill_evacuation_role_id: number;
    floor: number;
    resposibility: string;
}


