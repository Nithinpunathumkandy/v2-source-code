export interface PlanByStatus {
    count:number;
    id:number;
    title:string
}

export interface ProgramByCategories {
    count:number;
    id:number;
    title:string
}

export interface CorrectiveActionByStatus {
    count:number;
    id:number;
    title:string
}

export interface FindingsByDepartment {
    count:number;
    id:number;
    title:string
}

export interface FindingsByMsTypes {
    count:number;
    id:number;
    title:string
}


export interface FindingsByStatus {
    count:number;
    id:number;
    title:string
}

export interface AuditCounts {
    ms_audit_corrective_action_count : number;
    ms_audit_count : number;
    ms_audit_finding_count : number;
    ms_audit_plan_count : number;

}

export interface AuditFindingCounts {
    ms_audit_corrective_action_count : number;
    ms_audit_count : number;
    ms_audit_finding_count : number;
    ms_audit_plan_count : number;

}