import { CreatedBy } from "../../human-capital/users/user-kpi";

export interface AmFinalReport{
    next_review_user_level: number;
    created_at: any;
    id:number;
    final_report_contents:any;
    am_individual_audit_plan_department:any;
    am_audit_details:any;
    created_by:CreatedBy;
    submitted_by:any;
    workflow_items:any;
    workflow_status:any;
}