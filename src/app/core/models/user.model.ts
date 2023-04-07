import { Status } from './status.model';
import { Address } from './address.model';
import { Organization } from './organization.model';
import { Branch } from './branch.model';
import { Division } from './division.model';
import { Department } from './department.model';
import { Section } from './section.model';
import { SubSection } from './sub-section.model';
import { Timezone } from './masters/general/timezone';
import { Roles } from './human-capital/users/users';

export interface User {
    roles: Roles[];
    id: number;
    name: string;
    email: string;
    language: {code: string,
                id: number,
                is_primary: number,
                is_rtl: number,
                status_id: number,
                title: string,
                type: string};
    address: Array<{ contact: Address, emergency: Address }>;
    organization: Organization;
    branch: Branch;
    division: Division;
    department: Department;
    section: Section;
    sub_section: SubSection;
    status: Status;
    designation:{title: string, is_super_admin: boolean, id: number};
    image_token: string;
    first_name: string;
    last_name: string;
    settings: UserSettings;
    mobile:number;
    image:Image;
}

export interface Image{
    ext: string;
    size: number;
    thumbnail_url:string;
    title:string;
    token:string;
    url:string;
}

export interface UserSettings{
    autolock_seconds: number;
    default_language_id: number;
    id: number;
    is_autolock: number;
    is_two_factor_auth_enabled: number;
    otp: string;
    otp_generated_at: string;
    timezone: Timezone;
    timezone_id: number;
    user_id: number;
}