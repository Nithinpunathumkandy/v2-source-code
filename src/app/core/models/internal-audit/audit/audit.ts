import { AuditeeLeaders, AuditLeaders , Schedules} from 'src/app/core/models/internal-audit/audit-plan/audit-plan';
import { Image } from '../../image.model';
import { AuditCriterion } from '../../masters/internal-audit/audit-criterion';
import { AuditObjective } from '../../masters/internal-audit/audit-objective';
import { AuditFindings } from '../audit-findings/audit-findings';

export interface Audit {
    id: number;
    audit_category_ids:string;
    audit_title: string;
    description: string;
    status: string;
    status_id :number;
    start_date:Date;
    title:string;
    audit_status :{
        is_published_plan:number;
        language: Language[];
    }
    reference_code: number;

    audit_report:{
        id:number;
        audit_report_status_id:number;
        audit_report_template_id:number;
    }
    end_date: Date;
    audit_status_title: string;
    audit_leader_designation:string;
    audit_leader_id:number;
    audit_type_title:string;
    audit_leader: AuditLeaders;
    auditee_leader: AuditeeLeaders;
    support_files: SupportFiles[];
    audit_schedules: Schedules[];
    findings: AuditFindings[];
    documents: Documents[];
    audit_plan: AuditPlan;
    audit_audit_criteria: AuditCriterion[];
    audit_audit_objectives: AuditObjective[];
    created_by: CreatedBy;
    created_at: string;
     
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}

export interface AuditPlan {
    id:number;
    audit_program_id:number;
    audit_leader_id:number;
    auditee_leader_id:number;
    reference_code:number;
    title:string;
    start_date:Date;
    end_date:Date;
    description:string;
}

export interface CreatedBy{
    designation: string,
    first_name: string,
    last_name: string,
    image:Image
  }
export interface AuditPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Audit[];
}

export interface SupportFiles {
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
    user_job_id:string;
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
    user_job_id:string;
}