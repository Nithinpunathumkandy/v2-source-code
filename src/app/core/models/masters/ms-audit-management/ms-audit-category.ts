export interface MsAuditCategory {
    id: number;
    title: string;
    ms_title:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface MsAuditCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditCategory[];
}
export interface MsAuditCategorySingle {
    description: string;
    id: number;
    title:string;
    languages: MsAuditCategoryLanguage[];
    
}
export interface MsAuditCategoryLanguage{
    id:number;
    ms_type:MsAuditCategorySingleLanguage[]
}
export interface MsAuditCategorySingleLanguage{
    description: string;
    language_id: number;
    title: string;
}
