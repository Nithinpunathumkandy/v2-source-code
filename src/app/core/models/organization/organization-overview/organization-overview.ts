import { Image } from "../../image.model";

export interface OrganizationOverview {
    document_id: number;
    kh_document;
    description: string
    document_title: string;
    ext;
    id: number
    module_id:number
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
    module_language_title: any
    expiry_date : Date;
    documents: any;
    image_title: string;
    image_token: string;
    image_url: string;
    image_thumbnail_url: string;
    module_group_id
}

export interface OrganizationOverviewPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: OrganizationOverview[];
    first_page_url: string
}