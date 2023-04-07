export interface ProjectKpi {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ProjectKpiPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectKpi[];
}
export interface ProjectKpiSingle {
    id: number;
    project_objective:ProjectObjective[];
    languages: ProjectKpiLanguage[];
    
}
export interface ProjectObjective{
    id:number;
    client_side_url:string;
 }

export interface ProjectKpiLanguage{
    id:number;
    riskcategory:ProjectKpiSingleLanguage[]
}
export interface ProjectKpiSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}