
import { Department } from "../../../department.model";
import { Division } from "../../../division.model";
import { CreatedBy } from "../../../general/created_by";
import { Organization } from "../../../organization.model";
import { Role } from "../../../role.model";
import { Section } from "../../../section.model";
import { SubSection } from "../../../sub-section.model";

export interface ModuleGroupsResponse {
    data:AuditModules[]
}

export interface AuditModules {
    module_id: number;
    module: string;
}

export interface AuditWorkflow {
    id: number;
    title: string;
    created_by_status: string;
    created_by_image_token: string;
    created_by_first_name :string;
    module_id: number;
    module_title:string;
}

export interface AuditWorkflowPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditWorkflow[];
}

export interface SingleAuditWorkflow {
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