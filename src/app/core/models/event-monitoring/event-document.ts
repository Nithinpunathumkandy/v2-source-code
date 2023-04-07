import { Image } from "src/app/core/models/image.model";


export interface EventDocument {
    document_id: number;
    kh_document;
    description: string
    document_title: string;
    ext;
    id: number
    event_description: string
    event_id: number
    event_is_system_event: number
    event_member_count: number
    event_start_date: string
    event_target_date: string
    event_title: string
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

export interface IndividualEventDocument {
    // versions: Version[];
    created_at: string;
    version_id: number;
    created_by;
    event_id: number;
    description: string;
    document_id: number;
    document_title: string;
    ext;
    id: number;
    kh_document;
    event;
    size;
    thumbnail_url;
    title: string;
    token;
    updated_at: string;
    updated_by: []
    url: string;
}

export interface EventDocument {
    document_id: number;
    kh_document;
    description: string
    document_title: string;
    ext;
    id: number
    event_description: string
    event_id: number
    event_is_system_event: number
    event_member_count: number
    event_start_date: string
    event_target_date: string
    event_title: string
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

export interface EventDocumentsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventDocument[];
}


