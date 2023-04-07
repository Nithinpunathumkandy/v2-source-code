export interface AuditReport {
    id: number;
    ms_audit_id: number;
    created_at: Date;
    updated_at: Date;
    created_by: CreatedBy;
    updated_by: any[];
    activityname: string;
    riskTypeValue:string;
    riskTypeValue2:string;
    type:string;
    title:string;
    tabletiltle:string;
    listPermission?: string;
    riskItemId: string; 
    reportType: string; 
    ms_audit_audit_report_content: MSAuditAuditReportContent[];
}

export interface MsAuditRiskDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditRiskDetails[];
}

export interface MsAuditRiskDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface CreatedBy {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile: null;
    image: Image;
    designation: string;
    department: string;
    status: Status;
}

export interface Image {
    title: string;
    url: string;
    token: string;
    size: number;
    ext: string;
    thumbnail_url: null;
}

export interface Status {
    id: number;
    title: Title[];
    label: string;
}

export interface Title {
    id: number;
    type: string;
    code: string;
    title: string;
    is_primary: number;
    is_rtl: number;
    created_at: Date;
    updated_at: Date;
    created_by: null;
    updated_by: null;
    status_id: number;
    pivot: TitlePivot;
}

export interface TitlePivot {
    status_id: number;
    language_id: number;
    title: string;
}

export interface MSAuditAuditReportContent {
    id: number;
    type: string;
    title: string;
    description: string;
    order: number;
    ms_audit_audit_report_id: number;
    created_by: number;
    created_at: Date;
    updated_by: null;
    updated_at: Date;
    section: string;
    ms_audit_audit_report_content_id: null;
    ms_audit_audit_report_content_childrens: MSAuditAuditReportContentChildren[];
    list_of_non_conformities?: ListOfNonConformities;
}

export interface ListOfNonConformities {
    id: number;
    title: string;
    ms_audit_plan_id: number;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: null;
    ms_audit_findings: any[];
}

export interface MSAuditAuditReportContentChildren {
    id: number;
    type: string;
    title: string;
    description: string;
    order: number;
    ms_audit_audit_report_id: number;
    created_by: number;
    created_at: Date;
    updated_by: null;
    updated_at: Date;
    section: string;
    ms_audit_audit_report_content_id: number;
    audit_details?: AuditDetail[];
    ms_audit_audit_report_content_childrens: any[];
    audit_objectives?: AuditObjective[];
    audit_scopes?: Scope[];
    certificate_reference?: CertificateReference[];
    certificate_scope?: Scope[];
    audit_team?: AuditTeam;
    audit_agenda?: AuditAgenda;
}

export interface AuditAgenda {
    agenda: any[];
}

export interface AuditDetail {
    id: number;
    title: string;
}

export interface AuditObjective {
    id: number;
    objective: null;
}

export interface Scope {
    id: number;
    scope: null | string;
}

export interface AuditTeam {
    lead_auditor: Auditor;
    auditee_lead: null;
    auditors: Auditor[];
    auditees: any[];
}

export interface Auditor {
    id: number;
    organization_id: number;
    branch_id: number;
    division_id: number;
    department_id: number;
    section_id: number;
    sub_section_id: null;
    user_id: number | null;
    designation_id: number;
    first_name: string;
    last_name: string;
    email: string;
    personal_email: null;
    is_auditor: number;
    is_top_user: number;
    is_first_login: number;
    is_include_in_oc: number;
    login_enabled: number;
    mobile: string;
    office_number: null | string;
    image_url: null;
    image_title: null;
    image_size: null;
    image_ext: null;
    image_token: null;
    assessment_score_previous: null;
    assessment_score: null;
    login_attempts: number;
    assessment_date: null;
    assessment_date_previous: null;
    password_reset_token: null;
    password_reset_token_expiry: null;
    login_blocked_at: null;
    password_updated_at: Date;
    user_license_id: null;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number | null;
    status_id: number;
    pivot?: LeadAuditorPivot;
    designation?: Designation;
}

export interface Designation {
    id: number;
    designation_level_id: number;
    designation_grade_id: null;
    designation_zone_id: null;
    previous_designation_id: number;
    is_ceo: number;
    is_super_admin: number;
    code: string;
    title: string;
    order: number;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: null;
    status_id: number;
}

export interface LeadAuditorPivot {
    ms_audit_plan_id: number;
    user_id: number;
}

export interface CertificateReference {
    id: number;
    title: string;
    description: string;
}


export interface ActivityLogPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ActivityLogs[];
}

export interface ActivityLogs {
    id: number;
    activity: string;
    activity_type: string;
    created_at: string;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    // data:Data;
    // detail:Detail[];
}