import { DocumentTypes } from '../../masters/knowledge-hub/document-types';

export interface Documents {

    count: number;
    created_at: string;
    created_by: number;
    created_by_first_name: string;
    created_by_last_name: string;
    document_id: number;
    document_version_title: string;
    ext: number;
    id: number;
    is_folder: number;
    is_latest: number;
    is_starred: number;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    updated_at: string;
    updated_by: string;
    updated_by_first_name: string;
    updated_by_last_name: string;
    url: string;
    version: string;


}

export interface Document {

    id: number;
    title: string,
    description: string,
    document_type_id: number,
    purpose: string,
    document_id: number,
    document_access_type_id: number,
    document_category_ids: number,
    document_sub_category_ids: number,
    document_sub_sub_category_ids: number,
    document_family_ids: number,
    country_ids: number,
    region_ids: number,
    ms_type_organization_ids: number,
    designation_ids: number,
    user_ids: number,
    tag_ids: number,
    industry_ids: number,
    name: string,
    ext: string,
    mime_type: string,
    size: number,
    url:string,
    thumbnail_url: string,
    token: string,
    version: string,
    document_files:SupportFile[],
    organization_ids: number,
    section_ids: number,
    sub_section_ids: number,
    division_ids: number,
    department_ids:number,
    review_users: {
        user_id: number,
        level:number
    },
    approval_users:{
        user_id: number,
        level:number
    },

}

export interface SupportFile {
    name: string;
    ext: string;
    mime_type: string;
    size: number;
    url: string;
    thumbnail_url: string;
    token: string;
  }
  

export interface DocumentsFolder{

    
    title: string;
    document_id: number;
    document_access_type_id: number;
    organization_ids: number;
    section_ids: number;
    sub_section_ids: number;
    division_ids: number;
    department_ids: number;
    designation_ids: number;
    user_ids: number;
    

}


export interface DocumentsPageinationResponse{
    current_page:number;
    total:number;
    per_page: number;
    from: number;
    data:Documents[];

}

export interface DocumentTypesPaginationResponse{
    current_page:number;
    total:number;
    per_page: number;
    from: number;
    data:DocumentTypes[];
}

export interface Image{
    name: string;
    ext: string;
    mime_type: string;
    size: number;
    url: string;
    preview: string;
    token: string;
    title: string;
    thumbnail_url?:string;
    is_deleted:boolean;
    id?: number;
    document_id?:number;
    is_new: boolean;
}

export interface ReviewUpdate{
    document_review_frequency_language_title:string
    comment:string
    document_last_review_date:string
    document_next_review_date:string
}

export interface ReviewUpdatePagination{
    current_page:number;
    total:number;
    per_page: number;
    from: number;
    data:ReviewUpdate[];
}