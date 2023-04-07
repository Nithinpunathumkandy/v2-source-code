// import { AuditableItem } from 'src/app/core/models/internal-audit/auditable-item/auditable-item';
import { AuditPlan } from 'src/app/core/models/internal-audit/audit-plan/audit-plan';

export interface AuditProgram {
    id: number;
    from: any;
    to:any;
    start_date: any;
    end_date: any;
    title: string;
    description: string;
    reference_code:string;
    risk_rating_analysis: {
        high: number;
        low: number;
        medium: number;
        very_high: number;
        extreme:number;
        no_risk_rating_items: number;
    }

    audit_program_status: {
        type: string;
    },
    audit_plan: AuditPlan[];
    auditors_count: number;
    audit_plan_count: number;
    auditable_items_count: number;
    audit_count: number;
    finding_count:number;
    remaining_days:number;
    program_days_completed:any;
    days_for_strating:number;
    from_process: number;
    from_risk: number;
    auditable_items: AuditableItem[];
    auditors: Auditors[];
    risk_rating_chart_data: RiskChart[];
    department_wise_diagram:DepartmentChart[];
    // status: string;
    // status_id :number;
    created_by: CreatedBy;
    created_at: string; 
    risk_rating_colors: Colors[];
}

export interface DepartmentChart{
    department:string;
    green:number;
    orange:number;
    red:number;
    yellow:number;
    grey:number;
    "light-green":number;
}

export interface Colors{
    green:string;
    orange:string;
    red:string;
    yellow:string;
}

export interface RiskChart{
    type: string;
    value: number;
    color: string;
}
export interface CreatedBy{
    designation: string,
    first_name: string,
    last_name: string,
    image:Image
  }

  export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}
export class Auditors {

    assessment_date: Date;
    assessment_date_previous: Date
    assessment_score: number;
    assessment_score_previous: number;
    email: string;
    first_name: string;
    designation: {
        title:string;
    };
    last_name: string;
    audit_categories: auditCategory[];
    total_audits:number;

}

export class auditCategory {

    id: number;
    title: string;
}

export class AuditableItem {
    id:number;
    auditable_item_category_id: number;
    auditable_item_id: number;
    auditable_item_type_id: number;
    description: string;
    reference_code: string;
    title: string;
    risk_rating: {
        title: string;
        id: number;
        type: string;
        language: Language[];

    }
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}

export interface AuditProgramPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditProgram[];
}

export interface AuditRiskRateType{
    title:string;
    audit_program_auditor_id:number;
    reference_code:number;
    description:string;
    label:string;
    id:number;
}

export interface SingleAuditor{
    id:number;
    user_id:number;
    audit_program_id:number;
    auditable_items:AuditableItem[];
    users:{
        id:number;
        is_auditor:number;
        image_token:string;
        image_url:string;
        image_title:string;
        first_name:string;
        last_name:string;
        designation:{
            id:number;
            title:string;
            code:string;
        }
    };
}