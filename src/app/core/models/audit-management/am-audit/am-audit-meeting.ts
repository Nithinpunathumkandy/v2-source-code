import { CreatedBy } from "../../human-capital/users/user-kpi";
import { Documents } from "../../knowledge-hub/documents/documents";
import { SubSection } from "../../human-capital/users/user-setting";
import { Department, Division, Organization, Section, Users } from "../../human-capital/users/users";
import { MeetingType } from "../../masters/mrm/meeting-type";
import { Orgnizer } from "../../mrm/meeting-plan/meeting-plan";

export interface AmMeeting {
   
    reference_code:string;
    id: number; 
    title: string;
    description:string;
    start:string;
    end:string;
    duration:string;
    meeting_types:MeetingType[];
    documents:Documents[]; 
    organizer:Orgnizer;
    created_at:string;
    created_by: CreatedBy;
    meeting_participants: Particpants[];
    divisions: Division[];
    departments: Department[];
    organizations: Organization[];
    sections: Section[];
    sub_sections: SubSection[];
    status:any;

}

export interface UnplannedAgenda{
    id: number,
    title:string,
}

export interface Particpants{
    id:number;
    is_attending:boolean;
    is_may_be:boolean;
    is_not_attending:boolean;
    is_pending:boolean;
    is_present:boolean;
    is_new:boolean;
    user:Users;
}
export interface AmMeetingPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmMeeting[];
}