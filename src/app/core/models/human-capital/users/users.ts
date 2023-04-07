import { AuditCategory } from '../../masters/internal-audit/audit-categories';

export interface Users {
    id: number;
    designation_id:number;
    first_name: string;
    last_name: string;
    email: string;
    image_token: string;
    designation_title: string;
    personal_email:string;
    user_license: string;
    user_license_type: string;
    designation:Designation;
}

export interface UserPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: Users[];
}

export interface IndividualUser {
    
    id:number;
    logo_url: string;
    title: string;
    organization: Organization;
    branch: Branch;
    division: Division;
    department: Department;
    section: Section;
    sub_section: Subsection;
    designation:Designation;
    country:Country;
    language: string;
    address: Address[];
    name: string;
    last_name: string;
    email: string;
    personal_email:string;
    roles: Roles[];
    status: Status;
    image_token:string;
    mobile:number;
    office_number:number;
    is_auditor:boolean;
    is_top_user:boolean;
    user_id:number;
    audit_categories:AuditCategory[];
    date_of_birth: string;
    national_insurance_number: string;
    joining_date: string;
    leaving_date: string;
    is_license_active: number;
    user_license?:{
        id: number;
        is_used: number;
        key: string;
        type: string;
    }
    reporting_user: Users;
    
}

export interface Roles {
    id: number,
    title: string,
    type : string,
}

export interface Country {
    id: number,
    title: string
}

export interface Address {
    id: number;
    user_id: number;
    type: string;
    address: string;
    street: string;
    city: string;
    state: string
    zip: string;
    country:Country;
    mobile:number;
    contact: string;
    relative_name:string;
    relationship:string;
    relative_mobile:number;
    country_id:number;
}


export interface Organization {
    id: number;
    title: string;
    description: string;
    logo_url: string;
    is_primary: number;
    establish_date: string;
    phone: string;
    address: string;
    website: string;
}

export interface Branch {
    id: number;
    title: string;
}

export interface Department {
    id: number;
    title: string; 
}

export interface Division {
    id: number;
    title: string; 
}

export interface Section {
    id: number;
    title: string; 
}

export interface Subsection {
    id: number;
    title: string; 
}

export interface Designation {
    id: number;
    title: string; 
    is_super_admin: boolean;
}

export interface Status{
    id:number;
    title:string;
    label:string;
}


export interface UserCount{
    total_user_count:number;
}


export interface UserRole{
    id: number;
    title: string;
}

export interface RolePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: UserRole[];
}