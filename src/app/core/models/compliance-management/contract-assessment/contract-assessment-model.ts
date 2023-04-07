import { array, number } from "@amcharts/amcharts4/core";


export interface Contract {
    id: number;
    title: string;
    closed_by: CreatedBy
    description: string;
    reference_code: number;
    start_date: string;
    target_date: string;
    created_by: CreatedBy;
    created_at: string;
}

export interface IndividualContract {
    id: number;
    title: string;
    reference_code: number;
    status:any;
    created_by: CreatedBy;
    created_at: string;  
    completed_checklist_count:number;
    total_checklist_count:number;
    document_version:Version;
    sla_and_contract_assessment_status:any;
    score:any;
    sla_and_contract_assessment_checklists:checklists[] 
}
export interface checklists
{
    answer:any
    checklist:any;
    id:number;
    title:string;
    documents:[];
}
export interface Version{
    id:number;
    title:string;
    token:string;
    ext:string;
    version:string;
    document_id:number;
    size:number;
}
export interface CreatedBy {
    designation: string;
    first_name: string;
    last_name: string;
    image: Image;
}

export interface ContractPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Contract[];
}


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    image_token: string;
    size: number;
    ext: string;
}





