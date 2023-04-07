export interface AuditTemplates {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
    audit_category
}
export interface AuditTemplatesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditTemplates[];
}

export interface AuditTemplateCoverPage {
    id:number;
    is_audit_date_in_cover_page:number;
    is_audit_leader_in_cover_page:number;
    is_company_logo_in_cover_page:number;
    is_cover_page:number;
    is_isorobot_logo_in_cover_page:number;
    is_ms_type_in_cover_page:number;
    cover_bg: Documents;
    cover_logo:LogoDocuments;
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_job_id:string;
    type:string;
}

export interface LogoDocuments {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_job_id:string;
    type:string;
}

export interface AuditTemplateIntroduction {
    introduction:string;
    is_introduction:number;
    introduction_bg:[]
}

export interface AuditTemplateAuditProgram {
    id:number;
    is_audit_program:number;
    is_audit_program_description:number;
    is_audit_program_end_date:number;
    is_audit_program_reference_number:number;
    is_audit_program_start_date:number;
    is_audit_program_title:number;
}

export interface AuditTemplateAudit {
    id:number;
    is_audit:number;
    is_audit_category:number;
    is_audit_criteria:number;
    is_audit_description:number;
    is_audit_end_date:number;
    is_audit_leader:number;
    is_audit_objectives:number;
    is_audit_reference_number:number;
    is_audit_start_date:number;
    is_audit_title:number;
    is_auditee_leader:number;
    is_departments:number;
    is_divisions:number;
    is_sections:number;
    is_sub_sections:number;
    is_subsidiaries:number;
}

export interface AuditTemplateSchedule {
    id:number;
    is_audit_schedule_auditable_items:number;
    is_audit_schedule_auditees:number;
    is_audit_schedule_auditor_attendance:number;
    is_audit_schedule_auditors:number;
    is_audit_schedule_checklist:number;
    is_audit_schedule_checklist_answers:number;
    is_audit_schedule_department:number;
    is_audit_schedule_division:number;
    is_audit_schedule_end_date_time:number;
    is_audit_schedule_reference_number:number;
    is_audit_schedule_section:number;
    is_audit_schedule_start_date_time:number;
    is_audit_schedule_sub_section:number;
    is_audit_schedule_subsidiary:number;
    is_audit_schedules:number;
}

export interface AuditTemplateFindings {
    id:number;
    is_finding_attachments:number;
    is_finding_auditable_items:number;
    is_finding_bar_chart_by_departments:number;
    is_finding_category:number;
    is_finding_checklist_answers:number;
    is_finding_department:number;
    is_finding_description:number;
    is_finding_division:number;
    is_finding_evidence:number;
    is_finding_pi_chart_by_finding_category:number;
    is_finding_pi_chart_by_risk_rating:number;
    is_finding_recommendation:number;
    is_finding_reference_number:number;
    is_finding_risk_rating:number;
    is_finding_section:number;
    is_finding_sub_section:number;
    is_finding_subsdiary:number;
    is_finding_title:number;
    is_findings:number;
    finding_category:Finding_category[];
    risk_rating:Finding_Risk_Rate[];

}

export interface Finding_category{
    id:number;
    title:string
}

export interface Finding_Risk_Rate{
    id:number;
    title:string
}

export interface AuditTemplateExecutiveSummary {
    id:number;
    is_excecutive_summary:number;
    is_excecutive_summary_finding_category:number;
    is_excecutive_summary_finding_department:number;
    is_excecutive_summary_finding_division:number;
    is_excecutive_summary_finding_recommendation:number;
    is_excecutive_summary_finding_reference_number:number;
    is_excecutive_summary_finding_risk_rating:number;
    is_excecutive_summary_finding_section:number;
    is_excecutive_summary_finding_sub_section:number;
    is_excecutive_summary_finding_subsidiary:number;
    is_excecutive_summary_finding_title:number;
}

export interface AuditTemplateConclusion {
    id:number;
    conclusion:string;
    is_conclusion:number;
    conclusion_bg:ConclusionImage;
}

export interface ConclusionImage {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_job_id:string;
    type:string;
}