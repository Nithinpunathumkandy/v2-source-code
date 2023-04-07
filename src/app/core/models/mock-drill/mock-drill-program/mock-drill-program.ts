import { CreatedBy } from '../../general/created_by';
import { UpdatedBy } from '../../general/updated_by';

export interface MockDrillProgram {
    id: number;
    mock_drill_type: string;
    venue: string;
    date: Date;
    resposibility: string;
    status: string;
}

export interface MockDrillProgramPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillProgram[];
}

export interface IndividualMockDrillProgram {
    id: number;
    mock_drill_type_id: number;
    reference_code: number;
    title: string;
    start_date: Date;
    end_date: Date;
    mock_drill_program_preplan: any;
    mock_drill_program_status: any[];
    locations: any;
    event: any;
    process: any;
    project: any;
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

export interface ProgramMapping {
    id: number;
    title: string;
    project;
    process;
    event;
    locations;
    site;
}