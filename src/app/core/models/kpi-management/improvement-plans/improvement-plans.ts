import { CreatedBy } from "../../general/created_by";
import { IndividualKpi } from "../kpi/kpi";
import { User } from "../../user.model";
export interface ImprovementPlansPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IndividualImprovementPlans[];
}

export interface IndividualImprovementPlans {
    id: number;
    title: string;
    reference_code:string;
    created_at:string;
    created_by:CreatedBy;
    description:string;
    updated_at:string;
    start_date:string;
    target_date:string;
    documents:Documents[];
    kpi_management_kpi_id:number;
    improvement_plan_status:ImprovementPlanStatus;
    kpi_management_kpi:IndividualKpi;
    responsible_user:User;
    responsible_user_designation:string;
    responsible_user_first_name:string;
    responsible_user_image_token:string;
    responsible_user_last_name:string;
    resolved_by:ResolvedBy;
    kpi_management_kpi_improvement_plan_status_label:string;
    kpi_management_kpi_improvement_plan_status_language_title:string;
    kpi_management_kpi_improvement_plan_status_type:string;
    kpi_management_kpi_improvement_plan_updates:KpiManagementKpiImprovementPlanUpdates[];
    kpi_title:string;
}

export interface ResolvedBy{
    comment:string;
    created_at:string;
    created_by:CreatedBy;
    documents:Documents;
    percentage:number;
}

export interface KpiManagementKpiImprovementPlanUpdates{
    comment:string;
    documents:Documents;
    id:number;
    kpi_management_kpi_improvement_plan_id:number;
    kpi_management_kpi_improvement_plan_status_id:number;
    percentage:number;
    created_at:string;
    
}

export interface ImprovementPlanStatus{
    color_code:string;
    label:string;
    type:string;
    language:Language[];
}

export interface Language{
    pivot:Pivot;
}

export interface Pivot{
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

