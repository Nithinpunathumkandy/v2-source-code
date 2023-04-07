export interface EACounts{
    ea_count: number;
    ea_finding_count: number;
}

export interface EACountsByCategory{
    id: number;
    title: string;
    count: number;
    label: string;
    color_code: string;
    percentage: number;
}

export interface EACountsByStatus{
    id: number;
    type: string;
    finding_statuses: string;
    label: string;
    color_code: string;
    count: number;
    percentage: number;
}

export interface EACountsByType{
    id: number;
    title: string;
    count: number;
    percentage: number;
}

export interface FindingCACountByStatus{
    id: number;
    type: string;
    finding_corrective_action_status_label: string;
    finding_corrective_action_status_color_code: string;
    finding_corrective_action_status_title: string;
    count: number;
    percentage: number;
}

export interface EACountByMsType{
    id: number;
    title: string;
    count: number;
    percentage: number;
}

export interface EACountByRiskRating{
    id: number;
    type: string;
    label: string;
    color_code: string;
    weightage: number;
    title: string;
    count: number;
    percentage: number;
}

export interface EACountByDepartmentAndRiskRating{
    id: number;
    title: string;
    code: string;
    grand_total: number;
    extreme: number;
    high: number;
    medium: number;
    very_high: number;
    low: number;
}

export interface FindingCAList{
    id: number;
    finding_corrective_action_reference_code: string;
    finding_corrective_action_title: string;
    finding_corrective_action_start_date: string;
    finding_corrective_action_target_date: string;
    finding_title: string;
    external_audit_title: string;
    finding_corrective_action_status_title: string;
    finding_corrective_action_status_type: string;
    finding_corrective_action_status_color_code: string;
    finding_corrective_action_status_label: string;
    responsible_user_first_name: string;
    responsible_user_last_name: string;
    // responsible_user_image_url: null,
    // responsible_user_image_title: null,
    // responsible_user_image_ext: null,
    // responsible_user_image_size: null,
    // responsible_user_image_token: null
}


