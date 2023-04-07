import { CreatedBy } from "../../bpm/controls/controls";
import { Department } from "../../department.model";
import { Division } from "../../division.model";
import { IncidentCategories } from "../../masters/incident-management/incident-categories";
import { IncidentDamageTypes } from "../../masters/incident-management/incident-damage-type";
import { IncidentSubCategory } from "../../masters/incident-management/incident-sub-category";
import { IncidentTypes } from "../../masters/incident-management/incident-type";
import { AuditCheckList } from "../../masters/internal-audit/audit-check-list";
import { Organization } from '../../organization.model';
import { Branch } from "../../organization/business_profile/branches/branches";
import { Stakeholder } from "../../organization/stakeholder/stakeholder";
import { Section } from "../../section.model";
import { SubSection } from "../../sub-section.model";
import { User } from "../../user.model";


export interface Incident {
    id: number;
    title: string;
    incident_at: string;
    incident_categories : IncidentCategories[];
    created_by_department: string;
    reported_by_first_name : string;
    reported_by_last_name : string;
    reported_by_designation : string;
    incident_status_title : string;
    documents: any;
    checklists: AuditCheckList[];
    action : string;
    created_at : string;
    created_by: CreatedBy[];
    image;
    status;
    departments: Department[];
    branches: Branch[];
    description : string;
    divisions: Division[];
    incident_damage_type : IncidentDamageTypes[];
    incident_status:{
        type
        id
    };
    incident_sub_categories : IncidentSubCategory[];
    incident_types : IncidentTypes[];
    involved_other_users;
    involved_users: User[] ;
    location : string;
    organizations : Organization[];
    reported_at : string;
    reported_by : User[];
    sections: Section[];
    stakeholders :  Stakeholder[];
    sub_sections : SubSection[];
    updated_at : String;
    updated_by;
    witness_other_users;
    witness_users:User[] ;
    reference_code : string;
    workflow_items:any
    submitted_by:any;
    next_review_user_level:any
    investigation: any;
}

export interface IncidentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Incident[];
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_job_id:string;
}

export interface IncidentInvestigators {
    created_at: string;
    created_by: CreatedBy[];
    investigation_leader;
    investigators;
    updated_at: string;
}

export interface IncidentMapping {
    id: number;
    title: string;
    projects;
    processes;
    customers;
    assets;
    services;
    organization_issues;
    products;
    controls;
    Strategic_objectives;
    risks;
}

export interface rootCause {
    incident : string;
    description : string;
    why : string;
    created_by_designation : string;
    created_by_first_name : string;
    created_by_last_name : string;
    created_by_image_token : string

}

