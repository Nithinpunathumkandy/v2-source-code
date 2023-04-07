import { ProcessGroup } from '../../bpm/arci/arci';
import { ProcessCategory } from '../../masters/bpm/process-category';
import { Department } from '../../masters/organization/department';
import { IssueCategory, IssueDomain, IssueType } from '../../organization/context/issue-list';



export interface RiskMapping {
    id: number;
    title:string;
    processes:RiskProcess[];
    organization_issues:RiskIssue[];
    incidents:Incidents[];

}

export interface RiskMappingPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskMapping[];
}

export interface RiskProcess{
    reference_code:number;
    title:string;
    process_group:ProcessGroup;
    process_department:Department;
    process_category:ProcessCategory;

}

export interface RiskIssue{
    reference_code:number;
    title:string;
    organization_issue_categories:IssueCategory[];
    organization_issue_departments:Department[];
    organization_issue_domains:IssueDomain[];
    organization_issue_types:IssueType[];

}

export interface Incidents{
    id: number
    reference_code:number;
    title:string;
    action
}

