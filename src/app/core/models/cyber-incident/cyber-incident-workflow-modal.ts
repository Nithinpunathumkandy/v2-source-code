import { CreatedBy } from "../../models/general/created_by"
import { Department } from "../../models/general/department"
import { Organization } from "../../models/organization.model"
import { SubSection } from "../../models/masters/organization/sub-section"
import { Section } from "../../models/masters/organization/section"
import { Division } from "../../models/masters/organization/division"
import { Role } from "../../models/role.model";

export interface ModuleGroupsResponse {
    data:CIModules[]
}

export interface CIModules {
    module_id: number;
    module: string;
}

export interface CIWorkflow {
    id: number;
    title: string;
    created_by_status: string;
    created_by_image_token: string;
    created_by_first_name :string;
    module_id: number;
    module_title:string;
}

export interface CIWorkflowPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CIWorkflow[];
}

export interface SingleCIWorkflow {
    id: number;
    title: string;
    created_at: string;
    created_by:CreatedBy;
    created_by_image_token: string;
    created_by_first_name :string;
    module: {
        id:number;
    };
    risk_categories:RiskCategories;
    departments:Department;
    divisions:Division;
    sub_sections:SubSection;
    organizations:Organization;
    sections:Section;
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

export interface RiskCategories {
    id: number;
    title: string;
    status_id:number;
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