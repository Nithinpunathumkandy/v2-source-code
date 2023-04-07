export interface KHSettings{
    ai_document_extract: boolean;
    ai_summary: boolean;
    id: number;
    recent_document_count: number;
    retain_days_in_trash: number;
    is_document_workflow:number ;
    is_reference_code:boolean;
    knowledge_hub_setting_type:{
        created_at: string;
        created_by: number;
        id: number;
        status_id: number;
        type: string;
        updated_at: string;
        updated_by: string;
    }
    customized_reference_code:CustomizedReferenceCode[];
    retain_days_in_archive:number;
}
export interface REFSettings {
      type: string,
      title: string,
      order: number,
      is_enable: boolean
}
export interface CustomizedReferenceCode{
    id:number;
    reference_type:string;
    title:string;
    knowledge_hub_setting_id:number;
    order:number;
}