import { ProfileJdService } from 'src/app/core/services/my-profile/profile/jd/profile-jd.service';
import { Status } from '../../status.model';

export interface ProfileJD{
    id: number;
    jd_id: number;
    jd_title:string;
}
export interface ProfileJDDetails{   
    id:number;
    jd:JD[];
    reporting_users:ReportingUser[];
    status:Status[];
    supervisor:Supervisor;
}

export interface ProfileJDPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProfileJD[];
}

export interface JD{
    description: null
    documents: [];
    id: number;
    status_id: number;
    title: string;
}

export interface ReportingUser{
    email: string;
    first_name: string;
    image_token:string;
    last_name: string;
    mobile: string;
    department: string;
    designation: string;
    image:{
        ext: string;
        size: number;
        title: string;
        token:string;
    }
}

export interface Supervisor{
    department: string;
    designation: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    mobile:string;
    image:{
        ext: string;
        title: string;
        token: string;
    }
    status:{
        id:number;
        label:string;
    }
}