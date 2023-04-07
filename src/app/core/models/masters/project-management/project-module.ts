export interface ProjectModule {
    id: number;
    project_module_language_title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface ProjectModulePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: ProjectModule[];
}



