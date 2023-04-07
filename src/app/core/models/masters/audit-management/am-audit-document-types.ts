import { Language } from "../../internal-audit/audit/audit";

export interface AmAuditDocumentTypes {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    languages:Language[]
}

export interface AmAuditDocumentTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmAuditDocumentTypes[];
}



export interface AmAuditSingle {
    id: number;
    languages: AmAuditLanguage[];
    
}
export interface AmAuditLanguage{
    id:number;
    pivot:AmAuditSingleLanguage[]
}
export interface AmAuditSingleLanguage{
    am_audit_document_type_id: string;
    language_id: number;
    title: string;
}