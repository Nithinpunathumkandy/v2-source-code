export interface StakeholderNeedsAndExpectations {
    id: number;
    need_and_expectation_id: number;
    need_and_expectation_title: string;
    stakeholder_id: number;
    stakeholder_title: string;
    stakeholder_type_id: number;
    stakeholder_type_title: string;
    organization_issue_id: number;
    organization_issue_title: string;
    process_id: number;
    process_title: string;
    process_reference_code: string;
    organization_issue_reference_code: string;
}

export interface StakeholderNeedsAndExpectationsPaginationResponse {
    current_page: number;
    data : StakeholderNeedsAndExpectations[];
    from: number;
    per_page: number;
    total: number;
}

