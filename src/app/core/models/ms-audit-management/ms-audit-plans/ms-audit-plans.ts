import { Department } from "../../department.model";
import { Division } from "../../division.model";
import { Organization } from "../../organization.model";
import { MsTypeDetails } from "../../organization/business_profile/ms-type/ms-type";
import { Section } from "../../section.model";
import { SubSection } from "../../sub-section.model";
import { User } from "../../user.model";
import { MsAuditPrograms } from "../ms-audit-programs/ms-audit-programs";
import { MsAuditTeam } from "../ms-audit-team/ms-audit-team";
import { MsAudit } from "../ms-audit/ms-audit";


export interface MsAuditPlansPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditPlans[];
}

export interface MsAuditPlans {
    reference_code:string;
    id: number;
    title:string;
    end_date: string;
    start_date: string;
    ms_types: string;
    auditees:User[];
    auditors:User[];
    checklist_group:ChecklistGroup;
    created_by:User;
    criteria:[];
    lead_auditee:User;
    lead_auditor:User;
    ms_audit_mode:MsAuditMode;
    ms_audit_program:MsAuditPrograms;
    objective:[];
    processes:any;
    scope:string;
    organization:Organization;
    department:Department[];
    division:Division;
    section:Section;
    sub_section:SubSection;
    team:MsAuditTeam;
    ms_type_organizations:MsTypeDetails[],
    created_at:string;
    lead_auditor_first_name:string;
    lead_auditor_last_name:string;
    lead_auditor_image_token:string;
    lead_auditor_designation_title:string
    auditee_lead_first_name:string;
    auditee_lead_last_name:string;
    auditee_lead_image_token:string;
    auditee_lead_designation_title:string;
    ms_audit_plan_checklists:MsAuditPlanChecklists[];
    next_review_user_level : number;
    submitted_by : string;
    workflow_items : any
    ms_audit_plan_review_update : any;
    ms_audit_schedules:[];
    is_preplan:boolean;
    ms_audits:MsAudit[];   
    ms_audit_plan_status:{
        language:[],
        type:string;
    };
}

export interface MsAuditPlanChecklists{
    id:number;
    checklist_id:number;
}

export interface MsAuditMode{
    id:number;
    language:Language[];
}

export interface Language{
    pivot:Pivot;
}

export interface Pivot{
    title:string;
    ms_audit_mode_id:number;
}

export interface ChecklistGroup{
    id:number;
    title:string;
}

