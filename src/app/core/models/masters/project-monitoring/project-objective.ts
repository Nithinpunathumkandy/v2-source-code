export interface ProjectObjective {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ProjectObjectivePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectObjective[];
}
export interface ProjectObjectiveSingle {
    id: number;
    project_theme :ProjectTheme[];
    languages: ProjectObjectiveLanguage[];
    
}
export interface ProjectTheme{
    id:number;
    client_side_url:string;
 }

export interface ProjectObjectiveLanguage{
    id:number;
    riskcategory:ProjectObjectiveSingleLanguage[]
}
export interface ProjectObjectiveSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}