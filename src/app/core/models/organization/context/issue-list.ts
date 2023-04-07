import { MsType } from '../business_profile/ms-type/ms-type';
import { Organization } from '../../organization.model';
import { Division } from '../../division.model';
import { Department } from '../../department.model';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { CreatedBy } from '../../general/created_by';
import { UpdatedBy } from '../../general/updated_by';
import { Status } from '../../general/status';
import { GeneralUser } from '../../general/general-user';
import { NeedsExpectaions } from '../../masters/organization/needs-expectations';
// import { Stakeholder } from '../../masters/organization/stakeholder';
import { StakeholderType } from '../../masters/organization/stakeholder-type';
import { StatusDetails } from '../../status-details';
import { Branch } from '../business_profile/branches/branches';

export interface IssueList{
    id: number;
    issue_id: number;
    reference_code: string;
    title: string;
    description: string;
    issue_status_id: number;
    created_at: string;
    updated_at: string;
    status_id: number;
    issues_title: string;
    issue_status_title: string;
    issue_categories: string;
    issue_types: string;
    issue_domains: string;
    responsible_users: string;
    processes: string;
    stakeholders: string;
    need_and_expectations: string;
    status: string;
    created_by_first_name: string;
    created_by_last_name: string;
    updated_by_first_name: string;
    updated_by_last_name: string;
    organizations: string;
    divisions: string;
    departments: string;
    sections: string;
    sub_sections: string;
    ms_types: string;
    checked: boolean;
}

export interface IssueListResponse{
    current_page: number;
    data: IssueList[];
    per_page: number;
    total: number;
    from: number;
}

export interface IssueCategory{
    id: number,
    title: string,
    is_pestel: number,
    is_swot: number,
    type: string,
    pivot: Pivot
}

export interface Pivot{
    organization_issue_id: number,
    issue_category_id: number,
}

export interface IssueType{
    id: number,
    title: string,
    is_internal: number,
    is_external: number,
    pivot: Pivot
}

export interface IssueDomain{
    id: number,
    title: string,
    created_at: string,
    updated_at: string,
    created_by: number,
    updated_by: number,
    status_id: number,
    pivot: Pivot
}

export interface IssueUser{
    id: number, 
    name: string, 
    email: string, 
    image_url: string, 
    designation: string
}

export interface Issue{
    created_at: string,
    created_by: GeneralUser
    description: string
    id: number
    status_id: number
    title: string
    updated_at: string
    updated_by: GeneralUser
}

export interface IssueProcess{
    id: number
    process_group_id: number
    process_category_id: number
    organization_id: number
    division_id: number
    department_id: number
    section_id: number
    process_group: ProcessGroup
    sub_section_id: number
    risk_rating_id: number
    title: string
    description: string
    scope: string
    cycle_time: string
    created_at: string
    updated_at: string
    created_by: GeneralUser
    updated_by: GeneralUser
    status_id: number
    pivot: Pivot
}

export interface ProcessGroup{
    created_at: string
    created_by: GeneralUser
    description: string
    id: number
    status_id: number
    title: string
    updated_at: string
    updated_by: GeneralUser
}

export interface IssueStakeHolder{
    stakeholder_id: number;
    stakeholder: Stakeholder;
    need_and_expectations: NeedsExpectaions[]
}

export interface Stakeholder{
    id: number;
    title: string;
    stakeholder_type_id: number;
    stakeholder_type: StakeholderType
}

export interface IssueMsType{
    id: number,
    ms_type_id: number,
    organization_id: number,
    ms_type_version_id: number,
    is_default: number,
    created_at: string,
    updated_at: string,
    created_by: number,
    updated_by: number,
    status_id: number,
    pivot: Pivot
    ms_type: {
        id: number,
        code: string,
        title: string,
        description: string,
        created_at: string,
        updated_at: string,
        created_by: number,
        updated_by: number,
        status_id: number,
    },
    ms_type_version:{
        id: number;
        ms_type_id: number;
        title: string;
    }
}

export interface IssueDetails{
    id: number,
    reference_code: string;
    organization: number,
    title: string;
    issue: Issue
    description: string,
    issue_status: IssueStatus;
    issue_categories: IssueCategory[],
    issue_types: IssueType[],
    issue_domains: IssueDomain[],
    users: IssueUser[],
    ms_type_organizations: IssueMsType[],
    organizations: Organization[],
    divisions: Division[],
    departments: Department[],
    sections: Section[],
    sub_sections: SubSection[],
    branches: Branch[],
    processes: IssueProcess[]
    stakeholders: IssueStakeHolder[]
    created_at: string,
    updated_at: string,
    created_by: CreatedBy
    updated_by: UpdatedBy[]
    status: StatusDetails;
}

export interface IssueStatus{
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    status_id: number;
}