export interface ProjectTheme {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ProjectThemePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectTheme[];
}
export interface ProjectThemeSingle {
    id: number;
    languages: ProjectThemeLanguage[];
    
}
export interface ProjectThemeLanguage{
    id:number;
    riskcategory:ProjectThemeSingleLanguage[]
}
export interface ProjectThemeSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}