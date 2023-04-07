import { CreatedBy } from "../../general/created_by";
import { MsAuditPlans } from "../ms-audit-plans/ms-audit-plans";


export interface MsAuditProgramsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditPrograms[];
}

export interface MsAuditPrograms {
    reference_code:string;
    id: number;
    created_at: string;
    is_completed:number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    end_date: string;
    ms_audit_category_title: string;
    ms_audit_program_title: string;
    ms_category_id: number;
    start_date: string;
    created_by:CreatedBy;
    ms_audit_category:MsAuditCategory;
    title:string;
    no_of_audit_plan:number;
    audit_plans:MsAuditPlans[];
    ms_types:[];
    preplan_status:any;
}

export interface MsAuditCategory{
    language:Language[];
    team:any;
    team_lead:any;
    team_user:[]
}

export interface Language{
    pivot:Pivot;
}

export interface Pivot{
    title:string;
    ms_audit_category_id:number;
}