import { Processes } from '../../bpm/process/processes';
import { CreatedBy } from '../../general/created_by';
import { Status } from '../../general/status';
import { Department } from '../../masters/organization/department';
import { Division } from '../../masters/organization/division';
import { MsType, MsTypeDetails } from '../../organization/business_profile/ms-type/ms-type';
import { Subsidiary } from '../../organization/business_profile/subsidiary/subsidiary';
import { Issue } from '../../organization/context/issue-list';
import { Users } from '../../human-capital/users/users';
import { Section } from '../../masters/organization/section';
import { SubSection } from '../../masters/organization/sub-section';
import { MeetingCategory } from '../../masters/mrm/meeting-category';
import { MeetingType } from '../../masters/mrm/meeting-type';
import { MeetingAgendaDetails } from '../../masters/mrm/meeting-agenda';
import { MeetingAgendaChildren } from '../../masters/mrm/meeting-agenda';
import { Venue } from 'src/app/core/models/masters/general/venue';
import { MeetingCriteria } from '../../masters/mrm/meeting-criteria';
import { MeetingObjective } from '../../masters/mrm/meeting-objective';
import { IndividualMeetings } from '../meetings/meetings';
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
export interface image{
ext:string;
size: number;
thumbnail_url: string;
title: string;
token: string;
url: string
}

export interface Orgnizer{
image:image;
designation:string;
email:string;
first_name:string;
id:number;
last_name:string;
mobile:string;
department:string;
status:number;
}

export interface Particpants{
    id:number;
    is_attending:boolean;
    is_may_be:boolean;
    is_not_attending:boolean;
    is_pending:boolean;
    user:Users;
}


export interface MeetingPlanPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IndividualMeetingPlan[];
}

export interface IndividualMeetingPlan {
    id: number;
    title: string;
    description:string;
    end_date:string,
    created_at: string;
    created_by:CreatedBy;
    departments:Department[];
    divisions:Division[];
    ms_type_organizations:MsTypeDetails[];
    organizations:Subsidiary[];
    processes:Processes[];
    meeting_plan_users:Particpants[];
    reference_code:string;
    sections:Section[];
    status:Status;
    start_date:string,
    meeting_category:MeetingCategory;
    sub_sections:SubSection[];
    updated_at:string;
    meeting_criteria:MeetingCriteria[];
    meeting_objectives:MeetingObjective[];
    documents:Documents[];
    meeting_types:MeetingType[];
    meeting_link : string,
    venue:Venue;
    issue:Issue[];
    organizer:Orgnizer;
    meeting_agendas:[];
    meeting_plan_meeting_agendas:MeetingAgendaDetails[];
    previous_meeting:IndividualMeetings;
    meeting_plan_status_title:string;
    meeting_plan_status_id:number;
    meeting_plan_status:MeetingPlanStatus;
    created_by_first_name:string;
    created_by_last_name:string;
    created_by_designation:string;
    meeting_id:number;
    process_count: number;
    risks_count: number;
    projects_count: number;
    products_count: number;
    customers_count: number;
    controls_count: number;
    strategic_objectives_count: number;
    findings_count: number;
    nocFindings_count: number;
    organization_issues_count: number;
    services_count: number;
    meeting:Meeting;
    reason_for_time_change:string;
    reason:string;
    meeting_plan_agenda:MeetingPlanAgenda[]
}
export interface MeetingPlanAgenda{
    title:string;
    id:number;
    
}

export interface MeetingPlanStatus{
    type:string;
    label:string;
    language:Language;
}

export interface Meeting{
    id:number;
}

export interface Language{
    pivot:{
        title:string;
    }
}