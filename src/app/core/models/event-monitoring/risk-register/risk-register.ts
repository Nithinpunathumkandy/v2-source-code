export interface RiskRegisterPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IndividualRiskRegister[];
}

export interface IndividualRiskRegister {
    event_id: any;
    organization_issue_ids: any;
    risk_impact_area_ids: any;
    risk_source_ids: any;
    title: any;
    risk_type_ids: any;
    reference_code:any;
    risk_status:any;
    description:any;
    departments:any;
    created_by:any
    risk_types:any
    risk_impact_areas:any
    risk_owner:any
    responsible_users:any
    created_at:any
    organization_issues:any
    is_analysis_performed: any
    is_corporate: any
    risk_control_plan: any
    risk_treatment_plan: any
    organizations: any
    divisions: any
    sections: any
    sub_sections: any
    risk_sources: any





}

export interface Events{
    title:string;
}