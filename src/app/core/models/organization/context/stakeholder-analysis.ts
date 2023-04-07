import { Stakeholder } from '../stakeholder/stakeholder';

export interface StakeholdersList{
    id: number;
    title: string;
    stakeholders: Stakeholder[];
}

export interface NeedsExpectationsList{
    id: number;
    title: string;
    need_and_expectations: StakeNeedsExpectations[];
}

export interface StakeNeedsExpectations{
    created_at: string;
    created_by: number;
    created_by_first_name: string;
    created_by_last_name: string;
    id: number;
    organization_issue_id: number;
    organization_issue_reference_code: string;
    process_id: number;
    process_reference_code: string;
    need_and_expectations_id: number;
    need_and_expectation_title: string;
    stakeholder_id: number;
    stakeholder_title: string;
    updated_at: string;
    updated_by: number;
    updated_by_first_name: string;
    updated_by_last_name: string;
}