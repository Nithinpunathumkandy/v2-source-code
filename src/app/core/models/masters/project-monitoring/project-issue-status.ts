export interface ProjectIssueStatus {
    id: number;
    project_issue_status_language_title: string;
    type: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ProjectIssueStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectIssueStatus[];
}
