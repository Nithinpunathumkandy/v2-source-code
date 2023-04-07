export interface Stakeholder {
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    description: string
    stakeholder: string
    event_supportive_title: string
    id: number
    reference_code: string
    title: string
    event_influence_title:string
}

export interface StakeholderPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Stakeholder[];
}
export interface StakeholderDetails {
    created_at: any
    created_by: any
    communication_channels:any
    contract_type: any
    description: string
    duration: number    
    engagement_strategy: any
    event_stakeholder_communication: any    
    event_stakeholder_need_and_expectation: any
    event_supportive: any
    event_influence: any
    feedback:string
    id: number
    is_contracted:number
    is_further_action_required: number
    reference_code: string
    stakeholder: any
}

export interface Needs {
    id?: number;
    title: string;
}
export interface Communications {
    id?: number;
    title: string;
}