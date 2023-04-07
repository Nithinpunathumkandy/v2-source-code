import { Branch } from '../../branch.model';
import { Department } from '../../department.model';
import { Division } from '../../division.model';
import { Qualification } from '../../human-capital/users/user-qualification';
import { Designation, Roles, Subsection } from '../../human-capital/users/users';
import { Organization } from '../../organization.model';
import { Section } from '../../section.model';

export interface profile{

    id:number;
    name:string;
    last_name: string;
    email:string;
    mobile:number;
    title:string;
    user_id: number;
    department:Department;
    address:profileAddress[];
    designation:Designation;
    division:Division;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    organization:Organization;
    qualifications:Qualification[];
    work_experiences:WorkExperience[];
    section:Section;
    sub_section:Subsection;
    certificates:Certificates[];
    branch : Branch;
    roles: Roles[]
    personal_email:string;
    user_license?:{
        id: number;
        is_used: number;
        key: string;
        type: string;
    }
}

export interface profileAddress{
    address:string;
    city: string;
    contact: number;
    relationship: string;
    relative_mobile: number;
    relative_name: string;
    state: string;
    street: string;
    type: string;
    user_id: number;
    zip: string;
}

export interface Certificates{
    certificate_name: string;
    ext: string;
    id: number;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    url: string;
    user_id: number;
}

export interface WorkExperience{
    company: string;
    designation: string;
    end: string;
    id: number
    location: string;
    start: string;
    user_id: number;
}