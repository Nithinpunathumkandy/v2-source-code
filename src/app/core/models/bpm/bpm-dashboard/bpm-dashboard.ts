export interface BPMCounts{
    process_control_count: number;
    process_count: number;
    process_group_count: number;
}

export interface BPMPieChart{
    color: string;
    count: number;
    id: number;
    label: string;
    percentage: number;
    risk_ratings: string;
}

export interface BpmList{
    color: string;
    id: number;
    label: string;
    risk_rating_id: number;
    risk_ratings: string;
    title: string;
    risk_score: number;
}

export interface BpmPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:BpmList[];
}

export interface BpmBarDepartment{
    count: number;
    department: string;
    department_code: string;
    id: number;
}

export interface BpmBarControls{
    control: string;
    count: number;
    id: number;
    reference_code: string;
}

export interface BpmBarOwner{
    count: number;
    first_name: string;
    id: number;
    last_name: string;
}