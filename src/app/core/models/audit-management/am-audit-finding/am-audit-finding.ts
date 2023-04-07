import { CreatedBy } from "../../human-capital/users/user-kpi";
import { Documents } from "../../knowledge-hub/documents/documents";
import { SubSection } from "../../human-capital/users/user-setting";
import { Department, Division, Organization, Section, Users } from "../../human-capital/users/users";
import { Orgnizer } from "../../mrm/meeting-plan/meeting-plan";

export interface AmFinding {
    am_audit: any;
    is_corrective_action_closed: any;
    am_audit_finding_risks: any;
    am_audit_test_plan:any;
    reference_code:string;
    id: number; 
    title: string;
    description:string;
    start:string;
    end:string;
    duration:string;
    documents:Documents[]; 
    organizer:Orgnizer;
    created_at:string;
    created_by: CreatedBy;
    meeting_participants: Particpants[];
    divisions: Division[];
    departments: Department[];
    organizations: Organization[];
    sections: Section[];
    sub_sections: SubSection[];
    status:any;
    remarks:string;
    recommendation:string;
    department_response:string;
    am_audit_finding_status:any;
    am_audit_finding_risk_rating: {
        color_code: string;
        created_at: string;
        created_by: number;
        id: number;
        label: string;
        status_id: number;
        type: string;
        weightage: number;
    }
    finding_risks:{
        title:string;
    }

}

export interface UnplannedAgenda{
    id: number,
    title:string,
}

export interface Particpants{
    id:number;
    is_attending:boolean;
    is_may_be:boolean;
    is_not_attending:boolean;
    is_pending:boolean;
    is_present:boolean;
    is_new:boolean;
    user:Users;
}
export interface AmFindingPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmFinding[];
}