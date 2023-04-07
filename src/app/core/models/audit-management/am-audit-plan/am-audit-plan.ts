import { CreatedBy } from "../../human-capital/users/user-kpi";
import { Frequency } from "../../masters/human-capital/user-report";

export interface AmAuditPlan{
    am_annual_plan_auditable_item_status: any;
    am_annual_plan_status: any;
    is_workflow_enabled: any;
    created_at: any;
    individual_audit_plan_workflow_items: any;
    individual_audit_plan_next_review_user_level: number;
    individual_audit_plan_submitted_by: any;
    next_review_user_level: any;
    workflow_items: any;
    submitted_by: any;
 
    id:number;
    reference_code:string;
    am_annual_plan_frequency:Frequency;
    am_audit_category:Category;
    start_date:string;
    end_date:string;
    created_by:CreatedBy;
    am_individual_audit_plan_status:any;

    
    }

    export interface Category{
        id:number;
        title:string;
    }
    
    export interface AmAuditPlanPaginationResponse{
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
        from: number;
        data: AmAuditPlan[];
    }