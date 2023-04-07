import { CreatedBy } from "../../human-capital/users/user-kpi";
import { Documents } from "../../knowledge-hub/documents/documents";
import { SubSection } from "../../human-capital/users/user-setting";
import { Department, Division, Organization, Section, Users } from "../../human-capital/users/users";
import { Orgnizer } from "../../mrm/meeting-plan/meeting-plan";

export interface AmCSA {
    am_audit_control_self_assessment_status: any;
    am_audit_control_self_assessment_updates: any;
    am_audit_control_self_assessment_workflow_status:any;

    reference_code:string;
    id: number; 
    title: string;
    description:string;
    documents:Documents[]; 
    created_at:string;
    created_by: CreatedBy;
    department: Department[];
    status:any;
    submitted_by:any;
    workflow_items:any
    next_review_user_level:any
}


export interface AmCSAPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmCSA[];
}