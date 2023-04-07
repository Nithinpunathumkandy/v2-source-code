import { CreatedBy } from "../../general/created_by";
import { Kpi } from "../../masters/human-capital/user-kpi";
import { User } from "../../user.model";

import { Organization } from '../../organization.model';
import { Division } from 'src/app/core/models/masters/organization/division';
import { Department } from 'src/app/core/models/masters/organization/department';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { number, string } from "@amcharts/amcharts4/core";

export interface KpiPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IndividualKpi[];
}

export interface IndividualKpi {
    id: number;
    title: string;
    kpi_management_status_label:string;
    kpi_management_status_type:string;
    kpi_management_status_title:string;
    kpi_management_status_color_code:string;
    reference_code:string;
    department_title:string;
    calculation_type:CalculationType;
    created_at:string;
    created_by:CreatedBy;
    current_value:string;
    data_inputs:DataInputs[];
    department:Department;
    description:string;
    designations:Designations;
    formula:string;
    kpi:Kpi;
    kpi_management_status:KpiManagementStatus;
    kpi_review_frequency:KpiReviewFrequency;
    responsible_users:User;
    review_users:User;
    target:string;
    time_frame:string;
    unit:Unit;
    updated_at:string;
    start_date:string;
    end_date:string;
    documents:Documents[];
    submitted_by:any;
    next_review_user_level:any;
    workflow_items:any;
    achieved_percentage:string;
    achieved_value:string;
    organizations: Organization[];
    divisions: Division[];
    departments: Department[];
    sections: Section[];
    sub_sections : SubSection[];
    ms_type_clauses:MSTypeClauses[];
    ms_type:{
        id: number;
        title: string;
        ms_type_id:number;
        code:string;
        ms_type_version:{
            title:string;
            id:string;
        },
        ms_type:{
            id:number;
            title:string;
        }
    },
    ms_type_organization:msTypeOrganization;
}

export interface msTypeOrganization{
    id:number;
    title:string;
    ms_type_id:number;
    code:string;
    ms_type_version:{
        title:string;
        id:string;
    },
    ms_type:{
        id:number;
        title:string;
    }
}

export interface MSTypeClauses{
    id:number;
    clause_number:number;
    title:string;
}

export interface Unit{
    id:number;
    title:string;
}

export interface DataInputs{
    created_at:string;
    created_by:number;
    kpi_management_kpi_id:number;
    updated_at:string;
    variable:string;
    title:string;
}

export interface Designations{
    title:string;
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
}

export interface KpiManagementStatus{
    color_code:string;
    created_at:string;
    id:number;
    label:string;
    type:string;
    status:Status;
}

export interface Status{
    id:number;
    label:string;
    title:Title[];
}

export interface Title{
    pivot:Pivot;
}

export interface Pivot{
    title:string;
}

export interface KpiReviewFrequency{
    id:number;
    type:string;
    status:Status;
    title:string;
}

export interface CalculationType{
    id:number;
    type:string;
    kpi_calculation_type_language:Title;
}




// Workflow
export interface IndividualKpiWorkFlow{
    kpi_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

// workflow History


export interface WorkflowHistory{
    id:number;
    
}
export interface WorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: WorkflowHistory[];
}
