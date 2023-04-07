export interface ProjectPriority {
    id: number;
    title: string;
    description:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ProjectPriorityPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectPriority[];
}
export interface ProjectPrioritySingle {
    id: number;
    score:Score[];
    languages: ProjectPriorityLanguage[];
    
}
export interface ProjectPriorityLanguage{
    id:number;
    riskcategory:ProjectPrioritySingleLanguage[]
}
export interface ProjectPrioritySingleLanguage{
    description: string;
    language_id: number;
    title: string;
}
export interface Score{
    id:number;
    client_side_url:string;
 }