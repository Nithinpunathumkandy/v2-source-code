import { StringifyOptions } from 'querystring';
import { Job } from '../../masters/human-capital/user-job';
import { Status } from '../../status.model';

export interface UserJob {
    id: number;
    jd_id: number;
    jd_title: string;
    is_accordion_active?: boolean;
}

export interface Reporting {
    id: number;
    designation: string;
    email: string;
    first_name: string;
    last_name: string;
    image: Image;
    mobile: number;
}

export interface UserJobPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: UserJob[];
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at: string;
    created_by: number;
    thumbnail_url: string;
    updated_at: string;
    updated_by: string;
    user_job_id: string;
}


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}

export interface IndividualJob {
    id: number;
    title: string;
    documents: Documents[];
    is_deleted: boolean;
    image_token: string;
    reporting_users: Reporting[];
    supervisor: Reporting;
    created_by: Reporting;
    created_at: string;
    jd: Job;
    status:Status;
}
