export interface ProjectSettingsIssueCategory {
    id:number;
    title:string;
    created_by:any;
    created_at:string;
    assignee:any;
}

export interface ProjectSettingsIssueCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectSettingsIssueCategory[];
}


