import { CreatedBy } from '../../general/created_by';
import { UpdatedBy } from '../../general/updated_by';
export interface MockDrillReport {
    id: number;
    mock_drill_type: string;
    venue: string;
    date: Date;
    resposibility: string;
    status: string;
    created_at: string;
    updated_at: string;
    created_by: CreatedBy;
    updated_by: UpdatedBy[];
}
export interface MockDrillReportPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillReport[];
}