import { ResponsibleUser } from "../../bpm/process/activity";
import { CreatedBy } from "../../general/created_by";
import { UpdatedBy } from "../../human-capital/users/user-report";
import { Image } from "../../image.model";
import { UnsafeActionCategory } from "../../masters/jso/unsafe-action-category";
import { JsoUnsafeActionObservedGroup } from "../../masters/jso/unsafe-action-observed-group";
import { UnsafeActionSubCategory } from "../../masters/jso/unsafe-action-sub-category";
import { Status } from "../../status.model";
import { jsoObservations } from "../jso-observations/jso-observations.model";

export interface jsoUnsafeActions{
    id: number,
    corrective_action_responsible_user_first_name: string;
    corrective_action_responsible_user_id: number;
    corrective_action_responsible_user_image_token: string;
    corrective_action_responsible_user_last_name:string;
    jso_observation_id: number;
    unsafe_action_category_id: number;
    unsafe_action_observed_group_id: number;
    unsafe_action_status_id: number;
    unsafe_action_status_title: string;
    unsafe_action_sub_category_id: number

} 

export interface jsoUnsafeActionsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: jsoUnsafeActions[];
}

export interface IndividualJsoUnsafeAction {

    comments:string;
    closure_date:string;
    corrective_action: string;
    corrective_action_responsible_user: unsafeActionResponsibleUser;
    corrective_action_target_date: string;
    created_at: string;
    created_by:CreatedBy;
    id: number;
    description:string;
    reference_code:string;
    jso_observation: jsoObservations
    unsafe_action_category: UnsafeActionCategory
    unsafe_action_observed_group: JsoUnsafeActionObservedGroup;
    unsafe_action_status: UnsafeActionStatus;
    unsafe_action_sub_category:UnsafeActionSubCategory;
    updated_at: string;
    updated_by:unsafeActionUpdatedBy;
}

export interface UnsafeActionStatus{
    id:number;
    status_id: number;
    type: string;
    language:UnsafeActionLanguage[];
}

export interface unsafeActionResponsibleUser{
    designation: string,
    email: string,
    first_name: string,
    image: Image,
    last_name: string,
    id: number,
    department: string;
    mobile: any,
    status: Status
}

export interface unsafeActionUpdatedBy{
    department: string;
    designation:string;
    email:string;
    first_name: string;
    id: number;
    image: Image
    last_name: string;
    mobile:any;
}

export interface UnsafeActionLanguage{
    pivot:{
        title: string;
        unsafe_action_status_id: number
    }
}