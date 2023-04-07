import { CreatedBy } from "../../general/created_by";
import { Department } from "../../masters/organization/department";
import { WorkflowItems } from "../event-workflow/event-workflow";
import { Image } from "../../image.model";

export interface EventsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Events[];
}

export interface Events{
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    event_status_label:string;
    event_status_color:string;
    event_status_title:string;
    created_by_status: string;
    event_location_title:string;
    description: string;
    end_date: string;
    event_dimension_id: number;
    event_dimension_title: string;
    event_entrance_title: string;
    event_periodicity_id: number;
    event_periodicity_title: string;
    event_range_id: number;
    event_range_title: string;
    event_target_audience_id: number;
    event_target_audience_title: string;
    event_type_id: number;
    event_type_title: string;
    id: number;
    owner_firstname: string;
    owner_lastname: string;
    event_owner_designation:string;
    reference_code: string;
    start_date: string;
    title: string;
}

export interface EventDetails{
    created_at: string;
    created_by: CreatedBy;
    departments: Department;
    description: string;
    end_date: string;
    event_location: null
    event_dimension: null
    event_entrance: null
    event_periodicity: null
    event_range: null
    event_status: any
    event_type: null
    event_space_type: null
    event_priority: null
    event_target_audience: null
    id: number;
    owner: any;
    reference_code: string;
    event_members:[];
    event_assistant_managers:[];
    secondary_departments: []
    secondary_owners: []
    start_date: string;
    title: string;
    location: string;
    documents: any[];
    is_budgeted: number;
    workflow_items: WorkflowItems[];
    review_user: ResponsibleUsers;
    next_review_user_level: number;
    submitted_by: ResponsibleUsers;
    event_budgets:any
    event_closures:any
    event_expected_outcomes:any
    event_lesson_learned:any
    event_milestones:any
    event_objectives:any
    event_specifications:any
    event_stakeholders:any
    event_tasks:any    
    event_deliverables:any;
    event_risks:any;
    event_scopes: any;
    detailDocuments:any
    event_checklist_details: any
}

export interface ExpectedOutcomesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ExpectedOutcomes[];
}

export interface ExpectedOutcomes{
    event_id: number;
    event_title: string;
    id: number;
    title: string;
}

export interface ResponsibleUsers{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status?:{
        id:number;
    }
    designation: string,
    image_token?: string;
    image?:Image
  }