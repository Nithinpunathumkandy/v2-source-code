
export interface ProjectCounts{
    id: number;
    title: string;
    count: number;
    percentage: number;
}

export interface ProjectByDepartment{
    department_title: string;
    total_project: number;
}

export interface ProjectByContractTypes{
    id: number;
    project_contract_type: string;
    total_project: number;
}

export interface ProjectByPriority{
    id: number;
    project_priority: string;
    total_project: number;
}

export interface ProjectByYears{
    project_count: number;
    year: number;
}

export interface ProjectIssuesByStatuses{
    id: number;
    status: string;
    count: number;
}

export interface BudgetByYears{
    year: number;
    budget_sum: string;
}

export interface BudgetByDepartments{
    department_title: string;
    budget_sum: string;
}

export interface MilestoneByMonths{
    month_num: number;
    month: string;
    total_count: number;
    new_milestones: number;
    delayed_milestones: number;
    completed_milestones: number;
}

export interface MilestoneByDepartments{
    department_title: string;
    milestone_count: number;
}

export interface ProjectByTypes{
    id: number;
    project_type: string;
    total_project: number;
}

export interface ProjectIssuesByDepartment{
    department_title: string;
    total_project_issues: number;
}

export interface ProjectClosureByStatus{
    id: number;
    title: string;
    count: number;
}

export interface ProjectClosureByDepartments{
    id: number;
    title: string;
    count: number;
}

export interface ChangeRequestByDepartments{
    id: number;
    title: string;
    count: number;
}

export interface ChangeRequestByStatus{
    id: number;
    title: string;
    count: number;
}