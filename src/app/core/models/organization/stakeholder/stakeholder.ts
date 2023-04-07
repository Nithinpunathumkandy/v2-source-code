import { StakeholderType } from '../../masters/organization/stakeholder-type';
import { CreatedBy } from '../../general/created_by';
import { StatusDetails } from '../../status-details';

export interface Stakeholder {
    id: number;
    title: string;
    stakeholder_type_id: number;
    stakeholder_type: string;
    status: string;
    status_id: number;
    status_label: string;
    reference_code: string;
    monitoring_method: string;
}
export interface StakeholderPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Stakeholder[];
}

export interface StakeholderDetails{
    reference_code: string;
    created_at: string;
    created_by: CreatedBy;
    id: number;
    stake_holder_type: StakeholderType;
    status: StatusDetails;
    title: string;
    monitoring_method: string;
}

