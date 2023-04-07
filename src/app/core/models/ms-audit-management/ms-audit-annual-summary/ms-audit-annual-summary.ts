

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

export interface AnnualSummary {
    id: number;
    ms_audit_programs_id: number;
    created_at: Date;
    updated_at: Date;
    created_by: CreatedBy;
    updated_by: any[];
    msAuditAnnualSummaryReportContent: MSAuditAnnualSummaryReportContent[];
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
    pivot: Pivot;
}

export interface Pivot {
    status_id: number;
    language_id: number;
    title: string;
}

export interface MSAuditAnnualSummaryReportContent {
    id: number;
    type: string;
    title: string;
    description: string;
    ms_audit_annual_summary_report_id: number;
    order: number;
    created_by: number;
    created_at: Date;
    updated_by: null;
    updated_at: Date;
    finding_count_by_department: FindingCountByDepartment[];
}

export interface FindingCountByDepartment {
    id: number;
    title: string;
    count: number;
}
