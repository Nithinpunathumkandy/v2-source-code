export interface AuditCorrectiveActionResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditCorrectiveActions[];
}

export interface AuditCorrectiveActions {
    percentage : number;
    title : string;
    effectiveness : string;
    ms_audit_finding_corrective_action_status_type : string;
    
}

export interface AuditCorrectiveAcctionDetails {
    
}

export interface AuditCorrectiveActionHistoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditCorrectiveActionHistory[];
}

export interface AuditCorrectiveActionHistory {
    percentage : number;
    title : string;
    effectiveness : string;
    
}


