import { ProcessGroup } from '../../bpm/arci/arci';
import { AuditableItem } from '../../internal-audit/audit-findings/audit-findings';
import { ProcessCategory } from '../../masters/bpm/process-category';
import { Department } from '../../masters/organization/department';
import { Findings } from '../../non-conformity/findings';
import { IssueCategory, IssueDomain, IssueType } from '../../organization/context/issue-list';



export interface Mapping {
    id: number;
    title:string;
    processes:Process[];
    organization_issues:Issue[];
    risks:Risks[];
    controls:controls[];
    projects:Projects[];
    products:Products[];
    customers:Customers[];
    strategic_objectives:StrategicObjectives[];
    findings:AuditableItem[];
    noc_findings:Findings[];
    meeting_plan_status:MeetingPlanStatus;
}
export interface MeetingPlanStatus{
    id:number;
    type:string;
}
export interface MappingPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: Mapping[];
}

export interface Process{
    reference_code:number;
    title:string;
    process_group:ProcessGroup;
    process_department:Department;
    process_category:ProcessCategory;

}

export interface Issue{
    reference_code:number;
    title:string;
    organization_issue_categories:IssueCategory[];
    organization_issue_departments:Department[];
    organization_issue_domains:IssueDomain[];
    organization_issue_types:IssueType[];
    
}

export interface Risks{
    reference_code:number;
    title:string;
    // organization_issue_categories:IssueCategory[];
    // organization_issue_departments:Department[];
    // organization_issue_domains:IssueDomain[];
    // organization_issue_types:IssueType[];
        
}

export interface controls{
    reference_code:number;
    title:string;
}

export interface Projects{
    reference_code:number;
    title:string;
    member_count:number;
    image_token:string;
    image_title:string;
    image_url:string;
}

export interface Products{
    reference_code:number;
    title:string;
    description:string;
}

export interface Customers{
    reference_code:number;
    title:string;
    address:string;
    contact_person:string;
}

export interface StrategicObjectives{
    id: any;
    is_selected: any;
    reference_code:number;
    title:string;
}
