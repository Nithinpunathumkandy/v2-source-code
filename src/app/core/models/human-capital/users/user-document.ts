import { StringifyOptions } from 'querystring';

export interface UserDocument {
    id: number;
    user_id: number;
    title: string;
    user_document_type_id: number;
    year: number;
    issue_date: string;
    date: string;
    expiry_date: string;
    days: number;
    user_document_type: DocumentType;
    is_expired: number;
    total_days: number;
    documents: Documents[];
    history: History[];
    files: Files[];
    is_deleted: boolean;
    image_token: string;
    created_by: CreatedBy;
    version: number;
    created_at: string;
    is_accordion_active:boolean;

}

export interface UserDocumentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: UserDocument[];
}

export interface Documents {
    id: number,
    user_document_type_id: number,
    user_document_type: DocumentType,
    user_document_detail_id: number
    user_document_file_ext:string;
    expiry_date: string,
    issue_date: string,
    year: number
    is_expired: number,
    days: number
    total_days: number,
    token: string,
    title: string,
    ext: string,
    size: string,
    url: string,
    remainig_days_percentage: string;
}

export interface DocumentType {
    id: number;
    title: string;
}

export interface History {
    id: number;
    user_document_type: DocumentType;
    year: string;
    days: number;
    expiry_date: string;
}
export interface Files {
    id: number;
    title: String;
    user_document_detail_id: number;

    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export interface CreatedBy {
    id:number;
    first_name: string;
    last_name: string;
    designation: string;
    image: Image;
    email:string;
    mobile:number;
    department:string;
}

export interface Image {
  
    title: String;
   
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
    
}

