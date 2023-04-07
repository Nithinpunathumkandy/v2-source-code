import { User } from "../../user.model";

export interface MeetingsMomDetails{
    children: MeetingMomChildren[];
    created_by: number;
    id: number;
    meeting_id: number;
    title: string;
    meeting_plan_meeting_agenda_id:number;
    agenda:{
        title:string;
        id:number;
    }
    action_plan:ActionPlan[]
}


export interface MeetingMomChildren{
    children: MeetingMomChildren[];
    created_by: number;
    id: number;
    meeting_id: number;
    title: string;
    updated_at: string;
}

export interface ActionPlan{

id: number;
responsible_user: User
responsible_user_id: number;
start_date: string;
target_date:string;
meeting_action_plan_status_id:number;

}