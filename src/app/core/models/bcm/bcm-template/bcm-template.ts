export interface BcmTemplate {
    created_at: string,
    created_by: CreatedBy,
    document_type: DocumentsType[],
    documents: Documents,
    id: number,
    title: String,
    token: string;
    reference_code: string;
    business_continuity_plan_template_content:{

        title:string;
        description:string;
    }

}

export interface CreatedBy{
    id: number, 
    first_name: string, 
    last_name: string, 
    email: string, 
    image_url: string,
    image_token:string; 
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

export interface DocumentsType{
    id: number,
    title: string,
    description: string,
    
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

export interface BcmTemplatePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BcmTemplate[];
}

export interface IndividualBcmTemplate{
    template_title:string;
    template_content:{
        id: number;
    title: string;
    order:number;
    description: string;
    }
    id: number;
    title: string;
    token:string;
    status_id:number;
    ext:string;
    size:string;
    url:string;
    created_by:CreatedBy
    created_at:string;


}