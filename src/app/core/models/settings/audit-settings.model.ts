export interface AuditSettings{
    id: number;
    is_auditee_leader_approval: number;
    is_process_auditable: number;
    is_risk_auditable: number;
    is_impact_analysis:number;
    is_import_auditable_item:number;
    is_import_process:number;
    is_import_risk:number;
    is_quick_correction:number;
    who_add_audit_schedule: string;
    who_add_corrective_action: string;
    who_add_findings: string;
    who_create_audit: string;
    who_create_audit_plan: string;
    who_publish_audit_plan: string;
    who_accept_resolved_corrective_action:string;
    who_accept_resolved_finding:string;
    is_audit_report_workflow:number;
}