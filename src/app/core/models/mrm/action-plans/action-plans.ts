import { CreatedBy } from "../../general/created_by";
import { Users } from "../../human-capital/users/users";
import { User } from "../../user.model";
import { IndividualMeetings } from "../meetings/meetings";

export interface ActionPlansResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ActionPlans[];
}

export interface ActionPlans {
    id: number;
    title: string;
    reference_code:string;
    responsible_user_designation_id:number;
    responsible_user_designation_title:string;
    responsible_user_first_name:string;
    responsible_user_last_name:string;
    responsible_user_image_token:string;
    meeting_action_plan_status_language_title:string;
    documents:Document[];
    meeting_action_plan_statuses_id: number;
    meeting_action_plan_status:Status;
    meeting_id:number;
    responsible:any;
    start_date:string;
    target_date:string;
    budget:number;
    description:string;
    meeting:IndividualMeetings;
    completion:string;
    created_at: string;
    created_by:CreatedBy;
    meeting_action_plan_watchers: Users;
    responsible_user:User;
    meeting_plan_id:number;
    action_plan_updates:ActionPlanUpdates;
    meeting_minutes:MeetingMinutes;
}
export interface MeetingMinutes{
    title:string;
    id:number;
    meeting_id:number;
    meeting_plan_meeting_agenda_id:number;
    agenda:Agenda
}

export interface Agenda{
    title:string;
    id:number;

}


export interface ActionPlanUpdates{
    comment:string;
    created_by:CreatedBy;
    documents:Document[];
    created_at:string;
}

export interface Status{
    type: string;
    label:string;
}

export interface HistoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: History[];
}

export interface History{
    id: number;
    comment: string;
    percentage: number;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    updated_at: string;
    meeting_action_plan_status_title: string;
    meeting_action_plan_status_id: number;
    meeting_action_plan_title: string;
    documents:Document[];
    label:string;
}
