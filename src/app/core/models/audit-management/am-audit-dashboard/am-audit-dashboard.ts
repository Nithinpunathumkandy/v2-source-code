export interface AMAuditCount {
    close: number
    close_percentage: number
    open: number
    open_percentage: number
    total_am_annual_plan: number
    total_am_audit: number
    total_am_individual_audit_plan: number
    total_finding: number
}

export interface AmAuditFindingCountByStatuses {
    id: number
    count: number
    title: string
}

export interface AmAuditProgramCountByCategory {
    id: number
    count: number
    title: string
}

export interface AmAuditFindingCountByDepartments {
    id: number
    count: number
    title: string
    month: string
    finding_count: number
    percentage: number
    subData: any
}

export interface AmAnnualPlanCountByAuditors {
    id: number
    am_annual_plans_count: number
    audit_manager_first_name: string
    audit_manager_last_name: string
    individual_audit_plans_count: number
}

export interface AmAnnualPlanCountByDepartments {
    am_annual_plans_count: number
    id: number
    individual_audit_plans_count: number
    title: string
}

export interface AmAnnualPlanCountByYears {
    individual_audit_plans_count: number
    id: number
    year: number
}

export interface AmAuditCorrectiveActionCountByStatuses {
    id: number
    count: number
    color: string
    label: string
}

export interface AuditStatuses{
    id: number
    count: number
    color: string
    label: string
    percentage: number
    type: string
    total_am_audit:number
    total_am_individual_audit_plan: number
}

export interface FindingCount{
    close: number
    close_percentage: number
    open: number
    open_percentage: number
    total_finding: number
    finding_by_risk_rating: any
}