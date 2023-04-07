import { CreatedBy, Documents } from '../../bpm/process/processes';
import { Files } from '../../human-capital/users/user-document';

export interface ProfileDocuments{ 
    user_document_type: string;
    user_document_type_id: number
    documents:DocumentsDetails[];
}

export interface DocumentsDetails{
    days: number;
    expiry_date: string;
    id: number;
    is_expired: number;
    issue_date: string;
    remaining_days_percentage: string;
    total_days: number;
    user_document_detail_id: number;
    user_document_file_ext: string;
    user_document_file_size: number;
    user_document_file_thumbnail_url: string;
    user_document_file_title: string
    user_document_file_token: string;
    user_document_file_url: string;
    user_document_title: string;
    year: number;
}

export interface IndividualDocument{
    days: number
    expiry_date:number;
    id: number;
    is_expired: boolean;
    issue_date: string;
    remaining_days_percentage:number;
    title: string;
    total_days: number;
    updated_at: string;
    updated_by: any;
    user_document_detail_id:number;
    user_id: number;
    version: number;
    year:number;
    created_at: string;
    created_by:CreatedBy;
    files:Files;
}
