

export interface MsAuditDoc {
    created_at: string;
    created_by: number;
    document_id: number;
    ext: string;
    id: number;
    kh_document: { 
        id: number;
        workflow_id: number; 
        document_template_id: number;
        reference_code: string;
        versions: Version[];
     }
    ms_audit_id: number;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    updated_at: string;
    updated_by: string;
    url: string;
    external_link: string;
}

export interface Version {
    document_id: number
    expiry_date: string
    ext: string
    id: number
    is_latest: number
    issue_date: string
    size: number
    thumbnail_url: string
    title: string
    token: string
    url: string
    version: string
}