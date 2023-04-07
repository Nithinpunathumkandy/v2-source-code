import { Department } from "../../department.model";
import { Division } from "../../division.model";
import { AuditCheckList } from "../../masters/internal-audit/audit-check-list";
import { AuditCriterion } from "../../masters/internal-audit/audit-criterion";
import { AuditObjective } from "../../masters/internal-audit/audit-objective";
import { Organization } from "../../organization.model";
import { Section } from "../../section.model";
import { SubSection } from "../../sub-section.model";
import { ChecklistAnswersList } from "../audit-findings/checklist-answers-list/checklist-answers-list";
import { AuditableItem } from "../audit-program/audit-program";

export interface AuditReport {
    audit_report_status: string;
    reference_code: string;
    cover_page: {
        id: number;
        company_logo: number;
        isorobot_logo: number;
        audit_leader: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            mobile: string;
            image_url: string;
            image_token: string;
            status_id: number;
            designation: {
                title: string;
            }
        },
        ms_type: string;
        audit_date: string;
        start_date: string;
        end_date: string;
        report_title: string;
        cover_bg: {

            audit_report_setting_id: number;
            type: string;
            title: string;
            token: string;
        },
        cover_logo: {
            token: string;
        },
    }

    index: {
        index_title: string;
        index_bg: {
            id: number;
            token: string;
        }
        index_details: Index[];
    },
    introduction: {
        introduction: string;
        introduction_bg: {
            id: number;
            token: string;
        }
    },
    audit_program: {
        reference_code: string;
        auditable_items_count:number;
        title: string;
        from: any;
        to: any;
        description: string;
        program_bg: {
            id: number;
            token: string;
        }
        department_wise_diagram: Diagram[];
        risk_rating_chart_data: RiskChart[];
        risk_rating_analysis: {
            high: number;
            low: number;
            medium: number;
            no_risk_rating_items: number;
            very_high: number;
        }
    },

    findings: findings[];

    conclusion: {
        conclusion: string;
        conclusion_bg: {
            id: number;
            token: string;
        }
    },
    common: {
        page_number: string;
        footer_logo: {
            id: number;
            token: string;
        }
        total_page_number:number;
    }

    audit: {
        start_date: any;
        end_date: any;
        title: string;
        reference_code: string;
        description: string;
        audit_id:number
        audit_leader: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            mobile: string;
            image_url: string;
            image_token: string;
            status_id: number;
        },
        auditee_leader: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            mobile: string;
            image_url: string;
            image_token: string;
            status_id: number;
        },
        departments: Department[];
        divisions: Division[];
        organizations: Organization[];
        sections: Section[];
        sub_sections: SubSection[];
        audit_criteria: AuditCriterion[];
        audit_objectives: AuditObjective[];



    },

    audit_schedules: audit_schedules[];

    findings_bar_chart_by_departments :Diagram[];
    findings_pi_chart_by_finding_category: Diagram2[];
    findings_pi_chart_by_risk_rating: FindingRiskChart[];
    excecutive_summaries: ExcecutiveSummaries[];
    excecutive_summaries_page_number:number;
    is_workflow:number;
    submittedBy:any;
    next_review_user_level:number;
    auditReportStatus:any;
    createdBy:any;
}
export interface Index {
    title:string;
    page_number:number;
}
export interface ExcecutiveSummaries{
    reference_code:string;
    finding_category : {
        title: string;
    }
    finding_title: string;
}

export interface FindingRiskChart {
    title: string;
    color:string;
    count:number;
}

export interface Diagram2{
    title: string;
    color:string;
    count:number;
}

export interface audit_schedules {
    auditable_items: AuditableItem[];
    auditees: Auditees[];
    auditors: Auditors[];
    checklists: AuditCheckList[];
    department: {
        title: string;
    };
    division: {
        title: string;
    };
    subsidiary: {
        title: string;
    }
    end_date: Date;
    start_date: Date;
    title: string;
    audit_plan: string;
    description: string;
    reference_code: number;

}

export interface Auditees {
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    is_auditor: number;
    pivot: {
        is_present: number;
    }
    designation: {
        title: string;
    },
    status_id: number;
    image_token: string;
}


export interface Auditors {
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status_id: number;
    is_auditor: number;
    pivot: {
        is_present: number;
    }
    designation: {
        title: string;
    },
    image_token: string;
}



export interface findings {
    title: string;
    reference_code: string;
    finding_category: {
        title: string;
    }
    department: Department[];
    division: Division[];
    subsdiary: Organization[];
    section: Section[];
    sub_section: SubSection[];
    evidence:string;
    recommendation:string;
    auditable_items: AuditableItem[];
    checklist_answers: ChecklistAnswersList[];
    attachments: Attachments[];
    risk_rating: {
        title: string;
        id: number;
        type: string;
        language: Language[];

    }
}

export interface Attachments {
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

export interface Diagram {
    department: string;
    grey: number;
    yellow: number;
    orange: number;
    green: number;
    red: number;
    id: number;
    black: number;
}

export interface RiskChart {
    type: string;
    value: number;
    color: string;
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}


export interface AuditReportPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditReport[];
}