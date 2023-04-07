import { CreatedBy } from "../../bpm/controls/controls";
import { Department } from "../../department.model";
import { Division } from "../../division.model";
import { UpdatedBy } from "../../general/updated_by";
import { Subsection } from "../../human-capital/users/users";
import { UnsafeActionCategory } from "../../masters/jso/unsafe-action-category";
import { JsoUnsafeActionObservedGroup } from "../../masters/jso/unsafe-action-observed-group";
import { UnsafeActionSubCategory } from "../../masters/jso/unsafe-action-sub-category";
import { Organization } from "../../organization.model";
import { Subsidiary } from "../../organization/business_profile/subsidiary/subsidiary";
import { Section } from "../../section.model";
import { Status } from "../../status.model";

export interface jsoObservations{
    id: number,
    work_area: string,
    safe_action: string,
    jso_observation_type_id: number,
    jso_observation_type_title: string,
    organization_id: number,
    organization: string,
    division_id: number,
    division: string,
    department_id: number,
    department:string,
    section_id: number,
    section: string,
    sub_section_id: number,
    sub_section: string
} 

export interface jsoObservationsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: jsoObservations[];
}

export interface IndividualJsoObservation {

    department: Department
    description: string;
    created_by: CreatedBy;
    division : Division;
    jso_observation_type : ObservationType;
    organization : Subsidiary;
    section :Section;
    sub_section :Subsection;
    unsafe_actions : UnsafeAction[];
    updated_by:UpdatedBy;
    work_area:string;
}

export interface ObservationType{
    description: string
    id: number
    status_id: number
    title: string
}

// export interface JsoOrganization{
//     address: string
//     branch_count: any
//     ceo_message: string
//     ceo_user_id: number
//     description: string
//     email: string
//     id: number
//     image_ext: string
//     image_size: number
//     image_title: string
//     image_token: string
//     image_url: string
//     is_primary: number
//     mision: string
//     phone: string
//     status_id: number
//     title: string
//     values: string
//     vision: string
//     website: string
// }

export interface UnsafeAction{
    corrective_action: string
    corrective_action_responsible_user_id: number;
    corrective_action_responsible_user:any;
    corrective_action_target_date: string
    description: string
    reference_code:string;
    id: number
    jso_observation_id: number
    unsafe_action_category :UnsafeActionCategory
    unsafe_action_observed_group : JsoUnsafeActionObservedGroup
    unsafe_action_sub_category:UnsafeActionSubCategory
    is_accordion_active:boolean;
    unsafe_action_category_id: number
    unsafe_action_observed_group_id: number
    unsafe_action_status_id: number
    unsafe_action_sub_category_id: number;
    unsafe_action_status:unsafeStatus;
}

export interface unsafeStatus{
    id: number;
    label: string;
    status_id: number;
    type:string;
    language:unsafeActionsStatusLanguage[];
}

export interface unsafeActionsStatusLanguage{
    pivot:{
        title: string;
    }
}