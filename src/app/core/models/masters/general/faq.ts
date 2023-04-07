export interface Faq {
    id: number;
    faq_language_title: string;
    faq_language_description: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface FaqPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: Faq[];
}

export interface FaqSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}
export interface FaqLanguage{
    id:number;
    riskcategory:FaqSingleLanguage[]
}
 export interface ModuleGroup{
    id:number;
    client_side_url:string;
 }

export interface FaqSingle {
    id: number;
    module_group:ModuleGroup[];
    languages: FaqLanguage[];
    
}