export interface OrganizationCount {
    total_branches: number;
    total_business_applications: number;
    total_customers: number;
    total_departments: number;
    total_divisions: number;
    total_issues: number;
    total_ms_types: number;
    total_produdcts: number;
    total_projects: number;
    total_services: number;
}

export interface OrganizationIssueSwot{
    count: number;
    id: number;
    title: string;
    percentage: number;
}

export interface OrganizationIssuePestel{
    count: number;
    id: number;
    percentage: number;
    title: string;
}

export interface OrganizationIssueDepartments{
    count: number;
    title: string;
    id: number;
}

export interface OrganizationIssueType{
    id: number;
    count: number;
    title: string;
}

export interface OrganizationIssueYear{
    total_count: number;
    year: number;
}

export interface OrganizationIssueDomain{
    count: number;
    id: number;
    percentage: number
    title: string;
}

export interface OrganizationIssueCategories{
    count: number;
    id: number;
    percentage: number
    title: string;
}

export interface OrganizationTopTenSwotIssues{
    data: topTenList[];
    count: number;
    id: number;
    percentage: number
    title: string;
    total: number;
}

export interface topTenList {
    id: number;
    issue_id: number;
    issue_status_id: number;
    issue_status_title: string;
    issues_title: string;
    title: string;
}


