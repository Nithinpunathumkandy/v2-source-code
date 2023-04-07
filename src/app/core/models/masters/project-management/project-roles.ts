export interface ProjectRoles {
    id: number;
    title: string;
    description:string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface ProjectRolesRespones {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: ProjectRoles[];
}



