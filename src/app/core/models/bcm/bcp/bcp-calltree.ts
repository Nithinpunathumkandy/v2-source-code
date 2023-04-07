export interface CallTreePaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:CallTreeUsers[];
}

export interface CallTreeUsers{
    business_continuity_plan_description: string;
    business_continuity_plan_id: number;
    business_continuity_plan_reference_code: string;
    business_continuity_plan_title: string;
    created_at: string;
    email: string;
    external_user_email: string;
    external_user_mobile: string;
    external_user_name: string;
    first_name: string;
    id: number;
    last_name: string;
    mobile: number;
}