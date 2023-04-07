import { CreatedBy } from "../../bpm/controls/controls";

export interface AmPreliminaryReport{
    next_review_user_level: any;
    workflow_items: any;
    submitted_by: any;
    created_at: any;
    id:number;
    preliminary_report_contents:any;
    am_individual_audit_plan_department:any;
    created_by:CreatedBy;
    workflow_status:any;
}