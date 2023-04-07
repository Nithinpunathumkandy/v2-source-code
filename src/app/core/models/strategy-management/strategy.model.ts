import { Department } from "../department.model";
import { Division } from "../division.model";
import { Organization } from "../organization.model";
import { Section } from "../section.model";
import { SubSection } from "../sub-section.model";
import { User } from "../user.model";

export interface StrategyProfileResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Strategy[];
}

export interface Strategy {
    id:number;
    reference_code : number;
    is_default :number;
    title:string;
    start_date : string;
    budget :string;
    departments;
    end_date : string;
    description : string;
    divisions;
    strategy_profile_status_id : number;
    strategy_profile_status_label : string;
    strategy_profile_status_title : string;
    strategy_profile_status_type : string;
    strategy_status_id : number;

}

export interface StrategyProfileNotesResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyProfileNote[];
}

export interface StrategyProfileNote {
    id: number
    title : string;
    organization_issues
    
}

export interface StrategyInduvalProfileNote {
    
}

export interface FocusAreaResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: FocusAreas[];
}

export interface FocusAreas {
    id:number;
    focus_area_title : string;
    weightage :any;
    strategy_profile_status_type

}

export interface ObjectiveResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Objectives[];
}

export interface Objectives {
    id:number
    objective_title : string;
    weightage : any
    target_unit_title : string,
    target : number
    strategy_profile_status_type : string
   

}
export interface InduvalObjectives {
    id:number;
    objective ;
    responsible_users;
    strategy_profile_focus_area;
    target:number;
    start_date:string;
    end_date : string;
    weightage : any;
    strategy_profile_focus_areas:[];
    target_unit_id:{
        id:number;
        title:string;
    }
    review_users:StrategyObjectiveReviewUser[];
    strategy_review_frequencies : any;
   
}
export interface KpiResponse {
  id;
  kpi_title : string;
  minimum;
  maximum;
  target;
  strategy_profile_status_type : string
}

export interface InduvalStrategyProfile {
    id:number;
    title : string;
    description : string;
    start_date : string;
    end_date : string;
    budget : string;
    created_by : User;
    departments: Department[];
    divisions: Division[];
    organizations : Organization[];
    sections: Section[];
    sub_sections : SubSection[];
    reference_code : string;
    strategy_profile_focus_areas;
    strategy_profile_status;
    white_sheet;
    review_users:StrategyProfileReviewUser[];
    
}

export interface StrategyProfileReviewUser{
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
    
}

export interface StrategyObjectiveReviewUser{
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
}

export interface NoteDetails {
    id: number
    title: string
    category : Category[];
}

export interface Category {
    id: number
    is_pestel: number
    is_swot: null
    issue: issues[];
    status_id: number
    title: string
    type: string
}

export interface issues{
    id:number
    issue_id: number
    issue_status_id: number
    reference_code: string
    status_id: number
    title: string
}

export interface historyPaginationData{
    data:historyData[]
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
}

export interface historyData{
    activity:string;
    comment:string;
    is_auto: number;
    module: string;
    activity_data : {
        created_at: string;
        end_date: string;
        start_date: string;
        title: string;
    }
}