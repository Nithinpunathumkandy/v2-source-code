import { Organization } from '../../organization.model';
import { Status } from '../../status.model';

export interface TemplateList{
    created_at: string,
    created_by: CreatedBy,
    document_type: DocumentsType[],
    documents: Documents,
    id: number,
    title: String,
    reference_code: string;

}

export interface DocumentsType{
    id: number,
    title: string,
    description: string,
    
}

export interface Template{
    title: string,
    description: string,
    document_type_ids: number,
    organization_ids: number,
    section_ids: number,
    sub_section_ids: number,
    division_ids: number,
    department_ids: number,
    name: string,
    ext: string,
    mime_type: string,
    size: number,
    url: string,
    thumbnail_url: string,
    token:string
}

export interface TemplateDetails{
    id: number,
    title:string,
    created_at: string,
    created_by: CreatedBy,
    departments: Common[],
    description: string,
    divisions: Common[],
    sections: Common[],
    reference_code: string;
    sub_sections: Common[],
    document_types: DocumentsType,
    organizations: Organization,
    documents: Documents[],
    status:Status
    
}

export interface Common{
    id:number,
    title: string,
}

export interface Documents{
 
    created_at: string,
    name:string,
    created_by: string,
    mime_type: string,
    ext: string,
    id: number,
    is_process_flow: number,
    process_id: number,
    size: number,
    thumbnail_url: string,
    title: string,
    token: string,
    updated_at: string,
    updated_by: string,
    url: string,
    document_template_id?:number
      
}
export interface CreatedBy{
    id: number, 
    first_name: string, 
    last_name: string, 
    email: string, 
    image_url: string, 
    designation: string,
    image: Image
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
    is_new: boolean;
}

export interface Checklists{
    document_template_id: number,
    content_id: number,
    checklist_ids: [number]
}

export interface Notes{
    document_template_id: number,
    content_id: number,
    notes:[string]
}

export interface TemplatePaginationResponse{

    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        to: number;
        total: number;
        per_page: number;
    },
    links: {
        first: string;
        last: string;
        next: string;
        prev: string;
    }
    data:TemplateList[];


}
