import { string } from "@amcharts/amcharts4/core";
import { expr } from "jquery";
import { ResponsibleUser } from "../../bpm/process/activity";
import { Department } from "../../human-capital/users/user-setting";
import { Language } from "../../incident-management/incident/corrective-action/incident-corrective-action";
import { Status } from "../../status.model";
import { IndividualMeetingPlan } from "../meeting-plan/meeting-plan";

// export interface ReportTemplates{
//     id: number;
//     title: string;
//     reference_code:string;
//     status:Status;
//     status_id:number;
//     status_label:string;
//     pages:Pages[];
// }

export interface ReportPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Reports[];
}

export interface Reports {
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    id: number;
    meeting_id: number;
    meeting_report_status_id: number;
    meeting_report_status_title: string;
    meeting_title: string;
    reference_code: string;
    updated_at: string;
    meeting_report_template_id: number;
    meeting_report_template_title:string;
    meeting_report_status_label:string;
}

export interface ReportDetails{

    cover_page: {
        data: coverPageData,
        label: Label
    },
    discussion: {
        data: string;
        label: Label
    },
    conclusion: {
        data: string;
        label: Label
    },
    mode_of_meeting: {
        data: modeOfMeetingData[],
        label: Label
    },

    meeting_report_action_plans: {
        data: actionPlanData[],
        label:Label
    },
    meeting_report_agendas: {
        data: agendaData[],
        label:Label
    },
    meeting_report_category: {
        data: string;
        label:Label
    },
    criteria: {
        data: criteriaData[],
        label:Label
    },
    date: {
        data: string,
        label: Label;
    },
    leader: {
        data:leaderData,
        label:Label;
    },
    location: {

            data: string,
            label: Label;
    },
    meeting_report_minutes_of_meeting: {
        data: momData[],
        label: Label;
    },
   meeting_report_objectives: {
        data: objectivesData[],
        label:Label,
    },
    participants: {
        data: participantsData[],
        label: Label
    },
    reference_code: {
        data: string;
        label: Label
    },
    meeting_report_related_issues: {
        data: relatedIssuesData[],
        label: Label
    },
    meeting_report_risk: {
        data: riskData[],
        label:Label
    },
    title: {
        data: string;
        label: Label
    },
    follow_up_meeting:{
    data: FollowUpMeeting;
    label: Label
    },
    ms_type:{
        data: MsType;
        label: Label
    }, 
    meeting_report_strategic_objective:{
        data: MeetingReportStrategicObjective;
        label: Label
    },
    meeting_report_project:{
        data: MeetingReportProject;
        label: Label
    },
    meeting_report_product:{
        data: MeetingReportProduct;
        label: Label
    },
    meeting_report_non_conformity:{
        data: MeetingReportNonConformity;
        label: Label
    },
    meeting_report_customer:{
        data: MeetingReportCustomer;
        label: Label
    },
    meeting_report_control:{
        data: MeetingReportControl;
        label: Label
    },
    meeting_report_audit_finding:{
        data: MeetingReportAuditFinding;
        label: Label
    },

}

export interface MeetingReportControl{
    title:string;
    reference_code:string;
}

export interface MeetingReportCustomer{
    reference_code:string;
    title:string;
    contact_person:string;
    address:string;
}

export interface MeetingReportAuditFinding{
    reference_code:string;
    title:string;
    finding_category:{
        title:string;
    }
    risk_rating:{
        label:string;
        language: Language[];
    }
    finding_status:{
        label:string;
        language: Language[];
    }
}

export interface MeetingReportNonConformity{
    reference_code:string;
    title:string;
    finding_category:{
        title:string;
    }
    risk_rating:{
        label:string;
        language: Language[];
    }
    finding_status:{
        label:string;
        language: Language[];
    }
}
export interface MeetingReportProject{
    title:string;
    description:string;
    project_manager:{
        image_token:string;
        last_name:string;
        first_name:string;
        designation:{
            title:string;
        }
    }
    member_count:number;
    location:{
        title:string;
    }
}

export interface MeetingReportProduct{
    title:string;
    description:string;
}

export interface MeetingReportStrategicObjective{
    title:string;
    description:string;
}

export interface MsType{
    ms_type:{
        title:string;
    }
}
export interface FollowUpMeeting{
    meeting_plan: IndividualMeetingPlan;
    title:string;
}
export interface modeOfMeetingData{
    type: string;
    
}
export interface coverPageData{
    created_at: string;
    created_by: number;
    ext: string;
    id: number;
    meeting_report_page_field_id: number;
    size: number;
    status_id: number;
    thumbnail_url: string;
    title: string;
    token: string;
    updated_at: string;
    updated_by: number;
    url: string;
}
export interface riskData{
    closed_at: string;
    created_at: string;
    created_by: number;
    departments: Department[];
// departments: (2) [{…}, {…}]
    description: string;
    id: number;
    is_analysis_performed: number;
    is_corporate: number;
    is_functional: number;
    is_residual_analysis_performed: number;
    is_workflow: number;
    last_review_note: string;
    next_review_date: string;
    next_review_user_level: number;
    pivot: { meeting_plan_id: number; risk_id: number;}
    reference_code: string;
    risk_category: { id: number; title: string; description: string; created_by: number; updated_by: string };
    risk_category_id: number;
    risk_classification_id: number;
    risk_control_plan_id: number;
    risk_date: string;
    risk_library_id: number;
// risk_observation: null
    risk_owner_id: number;
    risk_review_frequency_id: number;
    risk_status_id: number;
    risk_treatment_plan: string;
// risk_types: []
    title: string;
}
export interface relatedIssuesData{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    issue_id: number;
    issue_status_id: number;
    organization_issue_categories: OrganizationIssueCategories[];
    organization_issue_departments: OrganizationDepartments[];
    organization_issue_domains: OrganizationIssueDomain[];
    organization_issue_types: OrganizationIssueDomain[];
    pivot: { meeting_plan_id: number, organization_issue_id: number };
    reference_code: string;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
}

export interface OrganizationIssueDomain{
    id: number;
    title: string;
}
export interface OrganizationIssueCategories{
    created_at: string;
    created_by: number;
    id: number;
    is_pestel: number;
    is_swot: number;
    pivot: { organization_issue_id: number; issue_category_id: number}
    status_id: string;
    title: string;
    type: string;
    updated_at: string;
    updated_by: string;
}
export interface OrganizationDepartments{
    code: string;
    created_at: string;
    id: number;
    organization_id: number;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
}
export interface participantsData{
    created_at: string;
    created_by: number;
    id: number;
    is_validation: number;
    label: string;
    language: Language[];
    status_id: number;
    updated_at: string;
    updated_by: string;
}
export interface objectivesData{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    pivot: { meeting_plan_id: number; meeting_objective_id: number;}
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: string;
}

export interface momData{
    children: momData[];
    created_at: string;
    created_by: number;
    id: number;
    meeting_id: number;
    meeting_minute_id: number;
    title: string;
    updated_at: string;
    updated_by: string;
}
export interface leaderData{
    assessment_date: string;
    assessment_date_previous: string;
    assessment_score: string;
    assessment_score_previous: string;
    branch_id: number;
    created_at: string;
    created_by: string;
    department_id: number;
    designation_id: number;
    division_id: number;
    email: string;
    first_name: string;
    id: number;
    image_ext: string;
    image_size: string;
    image_title: string;
    image_token: string;
    image_url: string;
    is_auditor: number;
    is_first_login: number;
    is_top_user: number;
    last_name: string;
    login_attempts: number;
    login_blocked_at: string;
    mobile: string;
    organization_id: number;
    password_reset_token: string;
    password_reset_token_expiry: string;
    password_updated_at: string;
    section_id: number;
    status_id: number;
    sub_section_id: number;
    updated_at: string;
    updated_by: string;
    user_id: string;
}
export interface criteriaData{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    pivot: { meeting_plan_id: number; meeting_criteria_id: number;}
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
}
export interface agendaData{
    created_at: string;
    created_by: number;
    id: number;
    meeting_agenda_id: number;
    meeting_id: number;
    pivot: { meeting_plan_id: number; meeting_agenda_id: number}
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: string;
}
export interface actionPlanData{
    budget: number;
    completion: number;
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    meeting_action_plan_status_id: number;
    meeting_id: number;
    reference_code: string;
    responsible_user_id: number;
    spent_amount: number;
    start_date: string;
    target_date: string;
    title: string;
    updated_at: string;
    updated_by: number;
    responsible_user:ResponsibleUser;
    meeting_action_plan_status:{
        label:string;
        language:Language[];
    }
}

export interface Label{
    created_at: string;
    created_by: number;
    id: number;
    is_validation: number;
    label: string;
    language: Language[]
    status_id: number;
    updated_at: string;
    updated_by: string;
}



export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
}