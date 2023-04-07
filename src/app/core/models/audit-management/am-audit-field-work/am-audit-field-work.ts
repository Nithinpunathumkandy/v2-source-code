import { CreatedBy } from "../../human-capital/users/user-kpi";
import { Frequency } from "../../masters/human-capital/user-report";
import { AmTestPlan } from "../am-audit/am-audit-test-plan";

export interface AmAuditFieldWork{
    priliminary_report_workflow_status: any;
 
    id:number;
    reference_code:string;

    start_date:string;
    end_date:string;
    created_by:CreatedBy;
    am_individual_audit_plan:any;
    field_work_start_date:string;
    am_audit_test_plans:AmTestPlan[];
    description:string;
    created_at:string;
    am_audit_fieldwork_status:any;
    
    }

    export interface Category{
        id:number;
        title:string;
    }
    
    export interface AmAuditFieldWorkPaginationResponse{
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
        from: number;
        data: AmAuditFieldWork[];
    }

    export interface AmAuditProgressResponse{
        completed_percentage: number;
        audit_hours: number;
        total_findings_count: number;
        risk_ratings: AmAuditProgress[];
    }

    export interface AmAuditProgress{
        completed_percentage: number;
        audit_hours: number;
        total_findings_count: number;
        risk_ratings: RiskRatings[];
        am_audit_statuses:any;
    }

    export interface RiskRatings{
    id: number;
    type: string;
    weightage: number;
    label: string;
    color_code: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    status_id: number;
    findings_count: number;
    language: [
        {
            id: number;
            type: string;
            code: string;
            title: string;
            is_primary: number;
            is_rtl: number;
            status_id: number;
            pivot: {
                risk_rating_id: number;
                language_id: number;
                title: string;
            }
        }
    ]

    }