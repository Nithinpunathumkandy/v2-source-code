import { FindingCategory, FindingStatus } from "../../internal-audit/audit-findings/audit-findings";
import { Department } from "../../masters/organization/department";
import { Division } from "../../masters/organization/division";
import { Section } from "../../masters/organization/section";
import { SubSection } from "../../masters/organization/sub-section";
import { RiskRating } from "../../non-conformity/findings";
import { Subsidiary } from "../../organization/business_profile/subsidiary/subsidiary";
import { Language } from "../corrective-action/corrective-action";

export interface ExternalAuditCorrectiveActions {
    id: number;
    title: string;
    closed_by: CreatedBy
    description:string;
    reference_code:number;
    finding_id: number;
    start_date: string;
    target_date: string;
    responsible_user:ResponsibleUsers;
    documents: Documents[];
    created_by: CreatedBy;
    created_at: string;
    findings: CorrectiveActionFindings
    corrective_action_status: CorrectiveActionStatus
    finding_corrective_action_status_updates: CorrectiveActionStatusUpdates[]
    resolved_by :{
        created_at:string;
        comment: string;
        percentage: number;
        documents: Documents[];
        created_by :{
            id: number,
            first_name: string,
            last_name: string,
            email: string;
            mobile: number;
            status:{
                id:number;
            }
            designation: {
                title:string;
            },
            image_token: string;
            status_id : number;
            image:Image
        }
    }
}

export interface CorrectiveActionStatusUpdates{
    comment: string;
    created_at: string;
    created_by: CreatedBy
    finding_corrective_action_id: number;
    finding_corrective_action_status_id: number;
    finding_corrective_action_update_documents: Documents[]
    id: number;
    percentage: number;
}

export interface CorrectiveActionFindings{
    id: number;
    title: string;
    audit_id: number;
    description: string;
    departments: Department[];
    divisions: Division[];
    sections: Section[]
    sub_sections: SubSection[]
    organizations: Subsidiary[]
    risk_rating: RiskRating;
    reference_code: string;
    documents: Documents[];
    findingStatus: FindingStatus;
    finding_category: FindingCategory;
}

export interface CorrectiveActionStatus{
    color_code: string;
    id: number;
    label: string;
    language: CorrectiveActionLanguage[]
    type: string;
}

export interface CorrectiveActionLanguage{
    code: string;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: CorrectiveActionPivot
    status_id: number;
    title: string;
    type: string;
}

export interface CorrectiveActionPivot{
    finding_corrective_action_status_id: number, 
    language_id: number, 
    title: string;
}
export interface CreatedBy{
    designation: string;
    first_name: string;
    last_name: string;
    image:Image;
  }

export interface ExternalAuditCorrectiveActionsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ExternalAuditCorrectiveActions[];
}


export interface ResponsibleUsers{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status:{
        id:number;
    }
    designation: string,
    image_token: string;
    image:Image
  }

  export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    image_token:string;
    size: number;
    ext: string;
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

