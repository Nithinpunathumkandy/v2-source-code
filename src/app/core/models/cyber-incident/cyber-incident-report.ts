export interface CyberReport {
    id: number;
    cyber_incident_id: number;
    created_at: Date;
    updated_at: Date;
    created_by: CreatedBy;
    updated_by: any[];
    activityname: string;
    riskTypeValue:string;
    riskTypeValue2:string;
    type:string;
    title:string;
    tabletitle:string;
    listPermission?: string;
    riskItemId: string; 
    reportType: string; 
    // ms_audit_audit_report_content: MSAuditAuditReportContent[];
}

export interface CyberIncidentReportList {
    id?: string;
    checkLevel?: any;
    analysisId?: string;
    title: string; 
    type: string; 
    reportType: string; 
    endurl: string; 
    riskItemId: string; 
    riskTypeValue: string;
    riskTypeValue2 ?: string;
    tabletitle: string; 
    activityname: string;
    listPermission?: string;
}

export interface CyberRiskDetailsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CyberRiskDetails[];
}

export interface CyberRiskDetails {
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

export interface CyberAuditReportContent {
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
    ms_audit_audit_report_content_childrens:CyberIncidentReportContentChildren[];
}



export interface CyberIncidentReportContentChildren {
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
    ms_audit_audit_report_content_childrens: any[];
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