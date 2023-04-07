import { CreatedBy } from '../../bpm/process/processes';
import { Status } from '../../status.model';

export interface MeetingAgenda {
    id: number;
    title: string;
    meeting_agenda:number;
    status: string;
    status_id :number;
    status_label: string;
}

export interface MeetingAgendaPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: MeetingAgenda[];
}

export interface MeetingAgendaDetails{
    children: MeetingAgendaChildren[];
    created_at: string;
    id: number;
    status: Status;
    title: string;
    meeting_agenda_type:MeetingAgendaType;
    owner:CreatedBy;
    start_time:string;
}

export interface MeetingAgendaType{
    created_at: string;
created_by: number;
description: string;
id: number;
status_id: number;
title: string;
updated_at: string;
updated_by: number;
}

export interface MeetingAgendaChildren{
    children: MeetingAgendaChildren[];
    created_at: string;
    id: number;
    meeting_agenda_id: number;
    status_id: number;
    title: string;
    updated_at: string;
}
