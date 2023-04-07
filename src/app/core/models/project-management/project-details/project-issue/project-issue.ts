
export interface ProjectIssue {
    id: number;
    title: string;
    description: string;
    documents: [];
    expiry_date : Date;
}

export interface ProjectIssuePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectIssue[];
}

export interface IndividualProjectIssue {
    id: number;
    document_id: number;
    ext: null
    description: string;
    project;
    size: null;
    thumbnail_url: null
    title: string;
    token: null;
    kh_document;
    document_title: string;
    versions: Version[];
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

