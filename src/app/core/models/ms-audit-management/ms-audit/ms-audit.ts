import { CreatedBy } from "../../bpm/process/processes";
import { Department } from "../../department.model";
import { Designation, Users } from "../../human-capital/users/users";
import { MsAuditSchedules } from "../ms-audit-schedules/ms-audit-schedules";

export interface MsAuditPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAudit[];
}

export interface MsAudit {
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    lead_auditor_designation_id: string;
    lead_auditor_designation_title: string;
    lead_auditor_image_token: string ;
    end_date: string;
    first_name: string;
    id: number;
    last_name: string;
    start_date: string;
    title: string;
    auditor_user_ids:string;
    lead_auditor_id:number;
   
}

export interface MsAuditDetails {
    auditees: MsAuditees[];
    auditors: MsAuditors[];
    created_at: string;
    created_by: CreatedBy
    // documents: []
    end_date: string;
    id: number;
    ms_audit_status:any;
    opening_start_date:string;
    closing_end_date:string;
    opening_participants:[];
    closing_participants:[]
    ms_audit_plan: { 
        lead_auditor:MsAuditees;
        auditees : MsAuditees[]
        checklist_group_id: number;
        created_at: string;
        created_by: number;
        ms_audit_plan_criteria: [];
        department_id: number;
        division_id: number;
        end_date: string;
        id: number;
        lead_auditee_id: number;
        lead_auditor_id: number;
        ms_audit_mode_id: number;
        ms_audit_program_id: number;
        ms_audit_plan_objectives: [];
        organization_id: number;
        reference_code: string;
        scope: string;
        section_id: number;
        start_date: string;
        sub_section_id: number;
        team_id: number;
        title: string;
        updated_at: string;
        ms_auditschedules:MsAuditSchedules[];
        ms_audit_program: {
            id: number;
            title: string;
        }
        // updated_by: null
    }

    
    start_date: string;
    title: string;
    updated_at: string;
    updated_by: {
        status : {
            label : string;
            title : []
        };

    }
}

export interface MsAuditees {
    // assessment_date: null
    // assessment_date_previous: null
    // assessment_score: null
    // assessment_score_previous: null
    branch_id: number;
    created_at: string;
    created_by: number;
    department_id: Department;
    designation: Designation;
    division_id: number;
    email: string;
    first_name: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    is_auditor: number;
    // is_first_login: 1
    // is_include_in_oc: 1
    // is_top_user: 0
    last_name: string;
    // login_attempts: 0
    login_blocked_at: string;
    // login_enabled: 1
    mobile: number;
    organization_id: number;
    // password_reset_token: null
    // password_reset_token_expiry: null
    password_updated_at: string;
    personal_email: string;
    pivot: { 
        ms_audit_plan_id: number; 
        user_id: number;
    }
    section_id: number;
    status_id: number;
    sub_section_id: number;
    updated_at: string;
    updated_by: number;
    user_id: number;
    user_license_id: number;
}

export interface MsAuditors {
    // assessment_date: null
    // assessment_date_previous: null
    // assessment_score: null
    // assessment_score_previous: null
    branch_id: number;
    created_at: string;
    // created_by: number;
    department_id: number;
    designation_id: number;
    division_id: number;
    email: string;
    first_name: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    is_auditor: number;
    // is_first_login: 1
    // is_include_in_oc: 1
    // is_top_user: 0
    last_name: string;
    login_attempts: number;
    login_blocked_at: string;
    login_enabled: number;
    mobile: number;
    organization_id: number;
    // password_reset_token: null
    // password_reset_token_expiry: null
    password_updated_at: string;
    personal_email: string;
    pivot: { 
        ms_audit_plan_id: number; 
        user_id: number; 
    }
    section_id: number;
    status_id: number;
    sub_section_id: number;
    updated_at: string;
    updated_by: number;
    user_id: number;
    user_license_id: number;
}
