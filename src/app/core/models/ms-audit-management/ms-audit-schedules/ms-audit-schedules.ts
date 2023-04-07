import { Department } from "../../general/department";
import { Auditees } from "../../internal-audit/audit-plan/audit-plan";
import { User } from "../../user.model";
import { MsAuditMode, MsAuditPlans } from "../ms-audit-plans/ms-audit-plans";
import { Language } from "../ms-audit-programs/ms-audit-programs";
import { MsAudit } from "../ms-audit/ms-audit";
import { Auditor } from "../ms-audit/ms-audit-details/audit-report";

export interface MsAuditSchedulesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditSchedules[];
}

export interface MsAuditSchedules {
    reference_code:string;
    id: number;
    created_at: string;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    title:string;
    start_date:string;
    end_date:string;
    ms_audit_schedule_status:string;
    status_type:string;
    label:string;
    lead_auditee_firstname:string;
    lead_auditee_lastname:string;
    lead_auditee_image_token:string;
    audit_plan_details:MsAuditPlans;
    auditees:AuditeesSchedule[];
    created_by:User;
    department:Department;
    lead_auditee:User;
    schedule_history:ScheduleHistory[];
    description:string;
    schedule_status:ScheduleStatus;
    schedule_date:ScheduleDate;
    processes : Process[];
    auditors:AuditorSchedule[]
    ms_audit_mode:MsAuditMode;
    
}

export interface AuditeesSchedule{
    id:Number;
    user:User
}

export interface AuditorSchedule{
    id:Number;
    user:User;
    user_id:number;
}

export interface Process {
    id : number;
    title : string;

}

export interface ScheduleDate{
    new_date:string;
    new_end_date:string;
    old_date:string;
    reason:string;
}

export interface ScheduleStatus{
    label:string;
    id:number;
    type:string;
    language:Language[];

}

export interface ScheduleHistory{
    created_at:string;
    id: number;
    ms_audit_schedule_id: number;
    ms_audit_schedule_status_id: number;
    new_date: string;
    new_end_date:string;
    old_date: string;
    reason: string;
    updated_at: string;
    created_by:User;
    schedule_update_status:ScheduleUpdateStatus;
}

export interface ScheduleUpdateStatus{
    label:string;
    type:string;
    language:Language[];
}