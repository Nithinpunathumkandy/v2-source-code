import { CreatedBy } from "../general/created_by";
import { Designation } from "../human-capital/users/users";

export interface StrategyInitiativeResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Initiatives[];
}

export interface Initiatives {
    status_title;
    department_title;
    budget;
    created_by_department;
    created_by_first_name;
    created_by_last_name;
    description;
    division_title;
    title;
    start_date;
    end_date;
    organization_title;
    reference_code;
}

export interface MilestonResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Milestone[];
}

export interface InduvalMileston {
    action_plans;
    budget;
    description;
    title;
    start_date;
    end_date;
}

export interface Milestone {
    title : string;
    description : string;
    start_date : string;
    end_date : string;
    budget : string;
    strategy_initiative_milestone_action_plans;
}

export interface InduvalInitiative {
    title;
    budget;
    description : string;
    end_date : string;
    start_date : string;
    responsible_users : any;
    strategy_initiative_action;
    departments;
    divisions;
    organizations;
    reference_code;
    strategy_profile_focus_area;
    focus_area;
    strategy_profile;
    sections;
    sub_sections;
    strategy_review_frequency;
    weightage;
    target_unit_id;
    target;
    strategy_profile_objective;
    kpis : any;
    strategy_initiative_status;
    actual_end_date;
    is_milestone : any;
    review_users : InitiativeReviewUser[]
    minimum:any;
    maximum:any;
    strategy_profile_objectives:[];
    strategy_profile_focus_areas:[];
    created_by:CreatedBy;
    created_at:any;
}

export interface InitiativeReviewUser{
    id: number,
    organization_id: number,
    branch_id: number,
    division_id: number,
    department_id: number,
    section_id: number,
    sub_section_id: number,
    user_id: number,
    designation_id: number,
    first_name: string,
    last_name: string,
    email: string,
    personal_email: string,
    mobile: string,
    designation: Designation;
    
}
