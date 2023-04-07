import { CreatedBy } from "../../human-capital/users/user-kpi";

export interface AmAudit {
    am_audit_field_work_status: any;
    am_audit_methodologies: {
        id:number;
        title:string;
    };
    created_at: any;
    id: number;
    reference_code: string;
    am_audit_category: Category;
    start_date: string;
    end_date: string;
    created_by: CreatedBy;
    description:string;
    objective:string;
    criteria:string;
    scope:string;
    out_of_scope:string;
    am_individual_audit_plan:any;
    audit_manager:any;
    auditors:any;
    field_work_start_date:string
}

export interface Category {
    id: number;
    title: string;
}

export interface AmAuditPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmAudit[];
}