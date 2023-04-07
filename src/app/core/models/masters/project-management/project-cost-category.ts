export interface ProjectCostCategory {
    id: number;
    title: string;
    can_delete:boolean,
    description:string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface ProjectCostCategoryPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: ProjectCostCategory[];
}



