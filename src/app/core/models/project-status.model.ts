export interface ProjectStatus{
    id: number;
    status_id: number;
    project_status_language_title: string;
    status: string;
}

export interface ProjectStatusResponse{
    current_page: number;
    data: ProjectStatus[];
    per_page: number;
    total: number;
}