import { CreatedBy } from "../../general/created_by";
import { SubSection } from "../../human-capital/users/user-setting";
import { Department, Division, Organization, Section, Users } from "../../human-capital/users/users";
import { MeetingsMomDetails } from "../../masters/mrm/meeings-mom";
import { MeetingType } from "../../masters/mrm/meeting-type";
import { Venue } from "../../masters/mrm/venue";
import { IndividualMeetingPlan, Orgnizer } from "../meeting-plan/meeting-plan";

export interface MeetingsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IndividualMeetings[];
}
export interface IndividualMeetings {

    reference_code:string;
    id: number; 
    title: string;
    description:string;
    start:string;
    end:string;
    duration:string;
    meeting_types:MeetingType[];
    meeting_link: string,
    venue:Venue;
    meeting_minutes:MeetingsMomDetails[];
    documents:Documents[]; 
    meeting_plan:IndividualMeetingPlan; 
    organizer:Orgnizer;
    created_at:string;
    created_by: CreatedBy;
    is_unplanned: number;
    meeting_unplanned_agendas:UnplannedAgenda[]
    meeting_participants: Particpants[];
    divisions: Division[];
    departments: Department[];
    organizations: Organization[];
    sections: Section[];
    sub_sections: SubSection[];
    conclusion: string;
    discussion: string;
}

export interface UnplannedAgenda{
    id: number,
    title:string,
}
export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
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
