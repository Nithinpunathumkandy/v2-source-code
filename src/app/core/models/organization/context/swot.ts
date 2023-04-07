export interface AnalysisPaginationResponse{
    current_page: number;
    data: Analysis[];
    per_page: number;
    total: number;
}

export interface Analysis{
    created_at: string;
    created_by: number;
    created_by_first_name: string;
    created_by_last_name: string;
    departments: string;
    description: string;
    divisions: string;
    id: number;
    issue_category_id: number;
    issue_category_title: string;
    issue_id: number;
    issue_status_id: number;
    issue_status_title: string;
    issue_type_id: number;
    issue_type_title: string;
    issues_title: string;
    organizations: string;
    reference_code: string;
    sections: string;
    status: string;
    status_id: number;
    sub_sections: string;
    title: string;
    updated_at: string;
    updated_by: number;
    updated_by_first_name: string;
    updated_by_last_name: string;
}

export interface AnalysisList {
    id: number;
    title: string;
    data: Analysis[];
    current_page: number;
    per_page: number;
    total: number;
}