import { Role } from "../../role.model";

export interface ModuleGroupsResponse {
    data:AmManagementModules[]
}

export interface AmManagementModules {
    module_id: number;
    module: string;
}

export interface AmWorkflow {
    id: number;
    title: string;
    created_by_status: string;
    created_by_image_token: string;
    created_by_first_name :string;
    module_id: number;
    module_title:string;
}

export interface AmWorkflowPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmWorkflow[];
}

export interface SingleAmWorkflow {
    id: number;
    title: string;
    created_at: string;
    created_by:CreatedBy;
    created_by_image_token: string;
    created_by_first_name :string;
    module: {
        id:number;
    };
    risk_categories:AmCategories;
    departments:Departments;
    divisions:Divisions;
    sub_sections:SubSections;
    organizations:organizations;
    sections:Sections;
    workflow_items:WorkflowItems[];
    description:string;
    role: Role
    status:{
        title:[{
            pivot:{
                title;
            }
        }]
    }
}

export interface CreatedBy {
    department: string;
    designation: string;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    mobile: string;
    image: UserImage;
    status: Status;
}

export interface UserImage {
    token: string;
}

export interface Status {
    id: number;
}

export interface WorkflowItems {
    created_at:string
    id:number
    level:number
    type:string;
}

export interface Designation {
    code:string
    id:number
    is_ceo:number
    title:string;
    level_id:number;
    level:number;
}

export interface AmCategories {
    id: number;
    title: string;
    status_id:number;
}

export interface Departments {
    id: number;
    title: string;
    status_id:number;
    organization_id:number;
    division_id:number;
}

export interface Divisions {
    id: number;
    title: string;
    status_id:number;
    organization_id:number;
}

export interface organizations {
    id: number;
    title: string;
    status_id:number;
}

export interface Sections {
    id: number;
    title: string;
    status_id:number;
    organization_id:number;
    department_id:number;
}

export interface SubSections {
    id: number;
    title: string;
    status_id:number;
    organization_id:number;
}

export interface Users {
    created_at:string
    id:number
    image_url:number
    image_title:string;
    image_token:string;
    first_name:string;
    last_name:string;
    level_id:number;
    level:number;
}

export interface Team {
    created_at:string
    id:number
    image_url:number
    image_title:string;
    image_token:string;
    level_id:number;
    level:number;
}