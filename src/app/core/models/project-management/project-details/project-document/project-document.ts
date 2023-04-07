
export interface ProjectDocument {
    document_id: number;
    kh_document;
    description: string
    document_title: string;
    ext;
    id: number
    project_description: string
    project_id: number
    project_is_system_project: number
    project_member_count: number
    project_start_date: string
    project_target_date: string
    project_title: string
    size: number
    thumbnail_url: string
    title: string
    token: null
    updated_at: string
    updated_by: number
    updated_by_department: string
    updated_by_designation: string
    updated_by_first_name: string
    updated_by_image_token: null
    updated_by_last_name: string
    updated_by_status: string
    url: string
    expiry_date : Date;
    documents: []
}

export interface ProjectDocumentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectDocument[];
}

export interface IndividualProjectDocument {
    versions: Version[];
    created_at: string;
    version_id: number;
    created_by;
    project_id: number;
    description: string;
    document_id: number;
    document_title: string;
    ext;
    id: number;
    kh_document;
    project;
    size;
    thumbnail_url;
    title: string;
    token;
    updated_at: string;
    updated_by: []
    url: string;
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

