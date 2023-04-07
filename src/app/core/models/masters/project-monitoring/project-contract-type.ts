export interface ProjectContractType {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ProjectContractTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectContractType[];
}
export interface ProjectContractTypeSingle {
    id: number;
    languages: ProjectContractTypeLanguage[];
    
}
export interface ProjectContractTypeLanguage{
    id:number;
    riskcategory:ProjectContractTypeSingleLanguage[]
}
export interface ProjectContractTypeSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}