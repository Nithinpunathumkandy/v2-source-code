import { ProcessDetails } from "../../bpm/process/processes";
import { Language } from "../../internal-audit/audit-program/audit-program";

export interface BiaPaginationResponse{
    current_page:number;
    total:number;
    per_page:number;
    from:number;
    data:BiaList[];
}

export interface BiaList{
    id:number
    department: string
    process_id: number
    bia_tire_title:string
    reference_code: string
    section: string
    status: string
    status_id: number
    status_label: string
    title: string
}

export interface Bia{
    analysis_id: number
    data: Category[]
    process: process;
    process_id: number
    scales: scale[]
}

export interface BiaAsstes {

}

export interface Category{
    bia_impact_rating_id: number
    bia_impact_scenario: Scenario[]
    id: number
    title: string
}

export interface Scenario{
    bia_impact_area: Area[]
    bia_impact_category_id: number
    id: number
    title: string
}

export interface Area{
    bia_impact_scenario_id: number
    bia_matrix_values: MatrixValues[]
    id: number
    title: string
}

export interface MatrixValues{
    bia_impact_rating: {id: number, rating: number, level: string,color_code}
    bia_impact_rating_id: number
    bia_scale: {id: number, from: number, to: number}
    bia_scale_id: number
    business_impact_analysis_matrix_id: number
    id: number
}

export interface process{
    id: number
    reference_code: string
    title: string
}

export interface scale{
    from: number;
    id: number;
    to: number;
    bia_scale_category_id:number;
    bia_scale_category:{
        languages:Language[]
    }
}

export interface TopCounts{
    hardware_count: number
    software_count: number
    total_number_of_staff: number
    asset_count : number
}

export interface softwarePagination{
    current_page:number;
    total:number;
    per_page:number;
    from:number;
    data:software[];
}

export interface software{
    amc_end: any
    amc_start: any
    business_application_type_id: number
    business_application_type_title: string
    id: number
    is_amc: number
    quantity: number
    status: string
    status_id: number
    status_label: string
    supplier_id: number
    supplier_title: string
    title: string
}

export interface ResourceRequirement{
    business_impact_analysis_id:number
    resource_requirements:resource_requirements[]
}

export interface resource_requirements{
    bia_scale_id: number
    hardware_ids: any
    no_of_staff: number
    software_ids: any
    asset_ids : any
}

export interface impact_result{
    application_tool_requirements:application_tool_requirements[]
    business_impact_analysis_id
    created_at
    dependency_processes:dependency_processes[]
    id
    submitted_by;
    next_review_user_level;
    business_impact_analysis_status:{
        id
        type
    }
    workflow_items;
    asset_requirements;
    manual_mtpd:{
        id : number
        bia_scale_category_id : number
        is_range_value : number
        from : string
        to : string
        bia_tire_id : number
        bia_tire_title : string
        bia_tire_color_code : string
        bia_scale_category:bia_scale_category
    }
    manual_rlo:number
    manual_rpo:{
        id : number
        bia_scale_category_id : number
        is_range_value : number
        from : string
        to : string
        bia_tire_id : number
        bia_tire_title : string
        bia_tire_color_code : string
        bia_scale_category:bia_scale_category
    }
    manual_rto:{
        id : number
        bia_scale_category_id : number
        is_range_value : number
        from : string
        to : string
        bia_tire_id : number
        bia_tire_title : string
        bia_tire_color_code : string
        bia_scale_category:bia_scale_category
    }
    over_all_count:{
        total_staff : number
        software_count : number
        hardware_count : number
    }
    process:any
    recommended_mtpd:{
        id : number
        bia_scale_category_id : number
        is_range_value : number
        from : string
        to : string
        bia_tire_id : number
        bia_tire_title : string
        bia_tire_color_code : string
        bia_scale_category:bia_scale_category
    }
    recommended_rto:{
        id : number
        bia_scale_category_id : number
        is_range_value : number
        from : string
        to : string
        bia_tire_id : number
        bia_tire_title : string
        bia_tire_color_code : string
        bia_scale_category:bia_scale_category
    }
    resource_requirements:resource_requirements[]
}

export interface resource_requirements{
    no_of_staff:number
    bia_scale:{
        bia_scale_category: {id: number, type: string}
        bia_scale_category_id: number
        from: string
        id: number
        is_range_value: number
        to: string
    }
}

export interface application_tool_requirements{
    titles:[]
    bia_scale:{
        bia_scale_category: {id: number, type: string}
        bia_scale_category_id: number
        from: string
        id: number
        is_range_value: number
        to: string
    }
}

export interface bia_scale_category{
    id 
    type 
}

export interface dependency_processes{
    id
    manual_mtpd
    manual_rlo
    manual_rpo
    manual_rto
    process_id
    recommended_mtpd
    recommended_rto
    related_process_id
    related_process_reference_code
    related_process_title
}