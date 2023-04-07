import { CreatedBy } from '../../bpm/process/processes';
import { Language } from '../../internal-audit/auditable-item/auditable-item';
import { DocumentAccessType } from '../../masters/knowledge-hub/document-access-type';
import { SubmittedBy } from '../documents/documentDetails';
import { WorkflowItems } from '../work-flow/workFlow';


export interface ChangeRequestPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    from: number;
    data: ChangeRequest[];

}

export interface ChangeRequestDetails{
     approval_users: []
    consequence: string;
    created_at: string;
    created_by: CreatedBy;
    description: string;
    document: {
        description: string;
        document_access_type: DocumentAccessType
        document_type: number;
        id: number;
        purpose: string;
        title: string;
    };
    document_change_request_status: {
        created_at: string;
        created_by: number;
        id: number;
        language: Language[]
        status_id: number
        type: string;
        updated_at: string;
        updated_by: null
        label:string
    };
    document_change_request_type: {
        created_at: string;
        created_by: number;
        icon: string;
        id: number;
        is_cancel: number;
        is_modify: number;
        language: [Language]
        status_id: number;
        updated_at: string;
        updated_by: number;
    };
    ext: string;
    files: NewFile;
    file: NewFile;
    id: number;
    name: string;
    reason: string;
    reference_code: string;
    review_users: [];
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    updated_at: string;
    updated_by: [];
    url: string;
    submitted_by:SubmittedBy
    workflow_items: WorkflowItems[]
    next_review_user_level: number;
    is_workflow: number;
    versions:any
}



export interface ChangeRequest{

    document_id: number,
    document_change_request_type_id:number,
    title:string,
    description: string,
    reason:string,
    consequence:string,
    name: string;
    ext: string;
    mime_type: string;
    size: number;
    url: string;
    thumbnail_url?:string;
    token: string;
    document_files:NewFile[]

}

export interface NewFile {
    document_change_request_id?: number;
    id?: number;
    name: string;
    ext: string;
    mime_type: string;
    title: string;
    size: number;
    url: string;
    thumbnail_url: string;
    token: string;
  }