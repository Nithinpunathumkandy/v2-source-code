import { AccountableUser, ResponsibleUser } from '../../bpm/process/activity';
import { Documents, ProcessInformedUsers } from '../../bpm/process/processes';

export interface ProfileRR{  
    id:number;
    title:string;
    accountable_users:AccountableUser[];
    consulted_users:CunsultedUser[];
    documents:[];
    informed_users:ProcessInformedUsers[];
    responsible_users:ResponsibleUser[];
}

export interface ProfileRRPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProfileRR[];
}

export interface CunsultedUser{
    email:string;
    first_name: string;
    image_token:string;
    last_name: string;
    mobile: number;
}