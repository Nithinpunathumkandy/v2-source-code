import { ProcessAccountableUsers, ProcessConsultedUsers, ProcessInformedUsers, ProcessResponsibleUsers } from "../process/processes";

export interface Controls {
    is_selected: any;
    control: Controls;
    control_type_id:number;
    control_category_id:number;
    control_sub_category_id:number;
    title:string;
    description:string;
    control_objectives: controlObjective[];
    id: number;
    control_efficiency_measure_label: string;
    control_efficiency_measure_language_title:string;
    reference_code: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface ControlDetails{

    id: number;
    description: string;
    reference_code: string;
    title:string;
    control_category: control_category;
    control_objectives: controlObjective[];
    control_sub_category: controlSubCategory;
    control_type: control_type;
    created_by: CreatedBy;
    created_at: string;
    control_efficiency_measure: ControlEffiencyMeasureByLanguage;
    control_control_efficiency_remarks: ControlEfficiencyRemarks[];
    control_mode:{
        id:number,
        type:string,
        title:string
    }
    control_documents:ControlDocuments[];
    control_accountable_users: ProcessAccountableUsers[],
    control_consulted_users: ProcessConsultedUsers[],
    control_responsible_users: ProcessResponsibleUsers[],
    control_informed_users: ProcessInformedUsers[],

}
export interface ControlDocuments{
    control_id: number;
created_at: string;
created_by: number;
document_id: number;
ext: string;
id: number;
kh_document: {
    versions:documentData[]

}
size: string;
thumbnail_url: string;
title: string;
token: string;
updated_at: string;
updated_by: string;
url: string;
}

export interface documentData{
    created_at: string;
    created_by: number;
    document_id: number;
    expiry_date: null
    ext: string;
    id: number;
    is_latest: number;
    issue_date: null
    size: number;
    sla_status_id: number;
    thumbnail_url: string;
    title: string;
    token: string;
    updated_at: string;
    updated_by: null
    url: string;
    version: string;
}
export interface ControlEfficiencyRemarks {
    control_id: number;
    id: number;
    status_id: number;
    title: string;
}

export interface ControlEffiencyMeasureByLanguage{
    id: number;
    is_not_applicable: number;
    label: string;
    language: ControlEfficiencyLanguage[]
    score: number;
    status_id: number;
}

export interface ControlEfficiencyLanguage{
    code: string;
    id: number;
    is_primary: number;
    status_id: number;
    title: string;
    type: string;
    pivot: {control_efficiency_measure_id: number; language_id: number; title: string;}
}

export interface CreatedBy{
    id: number;
    designation: string;
    email: string;
    first_name: string;
    last_name: string;
    mobile: number;
    image: Image;
}

export interface Image{
    title: string;
    thumbnail_url: string;
    token:string;
    }

export interface control_category{
    id: number;
    reference_code: number;
    title: string;
}
export interface control_type {
    id: number;
    title: string;
    description:string
}

export interface controlSubCategory{
    title: string;
    id: number;
    reference_code: number;
}


export interface controlObjective {
    title:string
}

export interface ControlPageinationResponse{
    current_page:number;
    total:number;
    per_page: number;
    from: number;
    data:Controls[];

}