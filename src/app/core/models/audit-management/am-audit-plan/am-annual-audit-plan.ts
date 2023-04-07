import { CreatedBy } from "../../human-capital/users/user-kpi";
import { Frequency } from "../../masters/human-capital/user-report";

export interface AmAnnualAuditPlan{
    next_review_user_level: any;
    workflow_items: any;
    submitted_by:any;
    id:number;
    reference_code:string;
    am_annual_plan_frequency:Frequency;
    am_audit_category:Category;
    start_date:string;
    end_date:string;
    created_by:CreatedBy;
    am_annual_plan_auditable_item:any;
    am_annual_plan_frequency_item:any;
    created_at:string
    auditors:any;
    audit_manager:any;
    departments:any;
    hours:string;
    am_individual_audit_plan_status:any;
    am_individual_audit_plan_workflow_status:any;
    }

    export interface Category{
        id:number;
        title:string;
    }
    
    export interface AmAnnualAuditPlanPaginationResponse{
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
        from: number;
        data: AmAnnualAuditPlan[];
    }