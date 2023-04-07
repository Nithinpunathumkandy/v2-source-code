import { User } from "../../../user.model";

export interface AuditNonConfirmityResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditNonConfirmity[];
}

export interface AuditNonConfirmity {
    date : string;
    id : number;
    description : string;
    created_by:User;
    created_at:string;
    agreed_date : string;
    effectiveness : string;
    ms_audit_finding_status : any;
    ms_audit_finding_strengths : any;
    ms_audit_finding_weaknesses : any;
    reference_code : string;
    responsible_users :any;
    responsible_user_ids:string;
    title : string;
    ms_audit_finding_root_cause_analysis:MSAuditFindingRootCauseAnalysis;
    ms_audit_finding_corrections:MsAuditFindingCorrections[];
    ms_audit_finding_corrective_actions:MsAuditFindingCorrectiveActions[]; 
    documents:Documents[];
    ms_audit_finding_ms_type_organizations:MsAuditFindingMsTypeOrganizations[];
    ms_audit_finding_corrective_action_type;
    ms_audit_finding_category:any;
    reason : string;
    preventive_action:string;
    ms_audit_schedule:any;
}

export interface MsAuditFindingMsTypeOrganizations{
    title:string;
    document_version_contents:DocumentVersionContents[]
}

export interface DocumentVersionContents{
    title:string;
}

export interface MsAuditFindingCorrectiveActions{
    id:number;
    title:string;
    description : string;
    ms_audit_finding_corrective_action_status_id:number;
}

export interface MSAuditFindingRootCauseAnalysis{
    id : number;
    description : string;
    created_by:User;
}

export interface MsAuditFindingCorrections{
    id : number;
    title : string;
    description : string;
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