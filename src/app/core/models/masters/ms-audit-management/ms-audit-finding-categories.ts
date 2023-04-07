export interface MsAuditFindingCategory {
    id: number;
    title: string;
    ms_title:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface MsAuditFindingCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditFindingCategory[];
}
export interface MsAuditFindingCategorySingle {
    description: string;
    id: number;
    title:string;
    languages: MsAuditFindingCategoryLanguage[];
    
}
export interface MsAuditFindingCategoryLanguage{
    id:number;
    ms_type:MsAuditFindingCategorySingleLanguage[]
}
export interface MsAuditFindingCategorySingleLanguage{
    description: string;
    language_id: number;
    title: string;
}
