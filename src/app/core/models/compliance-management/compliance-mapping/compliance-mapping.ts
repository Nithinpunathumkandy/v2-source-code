import { FindingStatus } from "../../internal-audit/audit-findings/audit-findings";
import { ProcessCategory } from "../../masters/bpm/process-category";
import { ProcessGroups } from "../../masters/bpm/process-groups";
import { AuditFindingCategory } from "../../masters/internal-audit/audit-finding-categories";
import { Department } from "../../masters/organization/department";
import { IssueCategory } from "../../masters/organization/issue-category";
import { IssueDomain } from "../../masters/organization/issue-domain";
import { RiskCategory } from "../../masters/risk-management/risk-category";
import { RiskType } from "../../masters/risk-management/risk-type";
import { IssueType } from "../../organization/context/issue-list";
import { RiskRating } from "../../risk-management/risks/risks";

export interface ComplianceMapping {
    id: number;
    title: string;
    processes: Processes[]
    organization_issues: OrganizationIssues[]
    risks: Risks[]
    findings: Findings[]
}

export interface ContractMapping {
    id: number;
    title: string;
    processes: Processes[]
    organization_issues: OrganizationIssues[]
    risks: Risks[]
    findings: Findings[]
}

export interface OrganizationIssues{
    created_at: string;
    description: string;
    id: number;
    issue_id: number;
    issue_status_id: number;
    organization_issue_categories: IssueCategory[]
    organization_issue_departments: Department[]
    organization_issue_domains: IssueDomain[]
    organization_issue_types: IssueType[]
    pivot: {document_id: number, organization_issue_id: number}
    reference_code: string;
    status_id: number;
    title: string;
}

export interface Findings{
    audit_id: number;
    audit_schedule_id: number;
    created_at: string;
    description: string;
    external_audit_id: number;
    finding_category: AuditFindingCategory
    finding_category_id: number;
    finding_status: FindingStatus;
    finding_status_id: number;
    id: number;
    pivot: {document_id: number, finding_id: number}
    recommendation: string;
    reference_code: string;
    risk_rating: MappingRiskRating;
    risk_rating_id: number;
    title: string;
}

export interface Processes{
    branch_id: number;
    created_at: string;
    cycle_time: string;
    department: Department;
    department_id: number;
    dependency_description: string;
    description: string;
    division_id: number;
    id: number;
    organization_id: number;
    pivot: {document_id: number, process_id: number}
    process_category: ProcessCategory;
    process_category_id: number;
    process_group: ProcessGroups;
    process_group_id: number;
    process_owner_id: number;
    reference_code: string;
    risk_rating_id: number;
    scope: string;
    section_id: number;
    status_id: number;
    sub_section_id: number;
    title: string;
}

export interface Risks{
    created_at: string;
    departments: Department[];
    description: string;
    id: number;
    is_analysis_performed: number;
    is_corporate: number;
    is_functional: number;
    is_registered: number;
    is_residual_analysis_performed: number;
    reference_code: string;
    risk_category: RiskCategory;
    risk_category_id: number;
    risk_classification_id: number;
    risk_control_plan_id: number;
    risk_date: string;
    risk_library_id: number;
    risk_observation: string;
    risk_owner_id: number;
    risk_register_type_id: number;
    risk_review_frequency_id: number;
    risk_status_id: number;
    risk_sub_category_id: number;
    risk_treatment_plan: string;
    risk_types: RiskType[]
    title: string;
    treatment_status_id: number;
}

export interface MappingRiskType{
    id: number;
    is_external: number;
    is_internal: number;
    language: RiskTypeLanguage[];
    pivot: {risk_id: number, risk_type_id: number};
    status_id: number;
}

export interface RiskTypeLanguage{
    code: string;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {risk_type_id: number, language_id: number, title: string}
    status_id: number;
    title: string;
    type: string;
}

export interface MappingRiskRating{
    color_code: string;
    created_at: string;
    id: number;
    label: string;
    language: MappingRiskRatingLanguage[]
    status_id: number;
    type: string;
    weightage: number;
}

export interface MappingRiskRatingLanguage{
    code: string;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {risk_rating_id: number, language_id: number, title: string}
    status_id: number;
    title: string;
    type: string;
}