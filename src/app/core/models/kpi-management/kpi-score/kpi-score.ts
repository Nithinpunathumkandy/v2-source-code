

export interface KpiScorePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IndividualKpiScore[];
}

export interface IndividualKpiScore {
    reference_code:string;
    id: number;
    kpi_management_kpi_id:number;
    date: string;
    justifications: string; 
    score: number;
    kpi_management_kpi_score_status_type: string;
    kpi_management_kpi_score_status_label: string;
    kpi_management_kpi_score_status_color_code:string;
    kpi_management_kpi_score_status_title: string;
    created_by: number;
    created_by_first_name: string;
    created_by_last_name: string;
    created_by_image_token: string;
    created_by_designation: string;
    created_by_department: string;
    created_by_status: string;
    created_at:string;
    updated_by: string;
    updated_by_first_name: string;
    updated_by_last_name: string;
    updated_by_image_token: string;
    updated_by_designation: string;
    updated_by_department: string;
    updated_by_status: string;
    updated_at: string;
    documents:Documents[];
    data_inputs:DataInputs[];
    kpi_management_kpi_status:string;
    kpi_title: string;
    kpi_management_kpi:any;
    kpi_management_kpi_score_status:KpiManagementKpiScoreStatus;
    kpi_management_kpi_formula:string;
    data_input_values:DataInputValues;
    reviewed_by_department: string;
    reviewed_by_designation: string;
    reviewed_by_first_name: string;
    reviewed_by_image_token: string;
    reviewed_by_last_name: string;
    reviewed_by_status: string;
    next_review_user_level:number;
    kpi_designation_user_ids:any;
    submitted_by:any;
    kpi_calculation_type:string;
    kpi_management_kpi_score_rating: scoreRatings;
}

export interface scoreRatings{
    color_code: string;
    label: string;
}
export interface DataInputValues{
    value:number;
    data_input:DataInput;
}

export interface DataInput{
    title:string;
    variable:string;
}

export interface KpiManagementKpiScoreStatus{
    color_code:string;
    id:number;
    label:string;
    type:string;
    status:Status;
}

export interface Status{
    title:Title[]
}

export interface Title{
    pivot:Pivot;
}

export interface Pivot{
    title:string;
}
export interface DataInputs{
    data_input_id: number;
    title: string;
    value: number;
    value_id: number;
    variable: string;
    values:Values[];
}

export interface Values{
    value:number;
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


// Workflow
export interface IndividualKpiWorkFlow{
    kpi_workflow_item_users: any;
    user: any;
    level: number;
    id:number;
}

// workflow History


export interface WorkflowHistory{
    id:number;
    
}
export interface WorkflowHistoryPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: WorkflowHistory[];
}
