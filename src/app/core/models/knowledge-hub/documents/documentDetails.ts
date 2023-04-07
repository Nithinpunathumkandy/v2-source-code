import { CreatedBy } from '../../bpm/process/activity';
import { Image } from '../../bpm/arci/arci';
import { Department } from '../../department.model';
import { Designation } from '../../human-capital/users/users';
import { Division } from '../../division.model';
import { Industry } from '../../masters/general/industry';
import { Organization } from '../../organization.model';
import { Region } from '../../masters/general/region';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { Tag } from '../../masters/knowledge-hub/tag';
import { UpdatedBy } from '../../general/updated_by';
import { WorkflowItems } from '../work-flow/workFlow';
import { ReviewUser } from './documentWorkFlow';


export interface FolderDetails{
    created_at: string
    created_by: CreatedBy;
    department: Department;
    departments: Department[];
    designations: Designation[];
    division: Division;
    divisions: Division[];
    document_access_type: DocumentAccessType;
    id: number;
    organization: Organization;
    organizations: Organization[];
    reference_code: string;
    section: Section;
    sections: Section[];
    sub_section: SubSection;
    sub_sections: SubSection[];
    title: string;
    updated_at: string;
    updated_by: UpdatedBy;
    users: Users;

}


export interface  DocumentDetails{
    
    id: number;
    // approval_users: CommonUsers[],
    countries: Country[];
    created_by: CreatedBy;
    created_at: string;
    department: Department;
    departments: Department[];
    description: string;
    designations: Designation[];
    division: Division;
    divisions: Division[];
    document_access_type: DocumentAccessType;
    document_categories: DocumentCategories[];
    document_families: DocumentFamiliy[]
    document_status: DocumentStatus;
    document_sub_categories: DocumentSubCategory[];
    document_sub_sub_categories: DocumentSubSubCategory[];
    document_type: DocumentType;
    files: Documents[];
    industries: Industry[];
    is_locked: number;
    locked_by: Users;
    ms_type_organizations: MsType[];
    organization: Organization;
    organizations: Organization[];
    purpose: string;
    reference_code: string;
    regions: Region[];
    // review_users: CommonUsers[];
    section: Section;
    sections: Section[];
    sub_section: SubSection;
    sub_sections: SubSection[];
    issue_date:string;
    tags: Tag[];
    title: string;
    is_workflow: number;
    next_review_user_level: number;
    updated_at: string;
    updated_by: UpdatedBy;
    versions: Documents[];
    users: Users;
    is_company_document: number;
    is_normal_document: number;
    submitted_by:SubmittedBy
    workflow_items:WorkflowItems[],
    document_review_frequency:DocumentReviewFrequency,
    review_users:ReviewUser,
    review_user:ReviewUser,
    next_review_date:string;
    last_review_date:string;
    ms_type_organization : any;
    owner:User;
    document_departments:Department[];
    document_divisions:Division[];
    document_organizations:Organization[];
    document_sections:Section[];
    document_sub_sections:SubSection[];
    document_template:any
}
export interface DocumentReviewFrequency{
    created_at: string;
created_by: number;
id: number;
order: number;
status_id: number;
type: string;
language:Language
updated_at: string;
updated_by: string;
}

export interface SubmittedBy{

    department: string;
    designation: string;
    email: string;
    first_name: string;
    id: number;
    image: Image;
    last_name: string;
    mobile: number;
}

export interface  DocumentMappingDetails{
    findings:[];
    organization_issues:[];
    processes:[];
    risks:[];
}

export interface CommonUsers{
    id: number;
    created_at: string;
    created_by: CreatedBy;
    level: number;
    status: number;
    user: User;
}

export interface User {
    designation: string;
    email: string;
    first_name: string;
    id: number;
    image: Image;
    last_name: string;
    mobile: number;
    department:string;
}

export interface Country{
    created_by: number;
    created_at: string;
    id: number;
    region_id: number;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
}

export interface DocumentAccessType{
    created_at: string;
    created_by: number;
    id: number;
    is_private: number;
    is_public: number;
    is_shared: number;
    language:Language[]
}

export interface Language{
    code: string;
    created_at: string;
    created_by: number;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {
        document_access_type_id: number;
        language_id: number;
        title: string;
    };
    status_id: number;
    title: string;
    type: string;
    updated_at: string;
    updated_by:number
    
}

export interface DocumentCategories{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
    pivot: {
        document_category_id: number;
        document_id: number;
    }
}

export interface DocumentFamiliy{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
    pivot: {
        document_family_id: number;
        document_id: number;
    }
}

export interface DocumentStatus{
    created_at: string;
    created_by: number;
    id: number;
    status_id: number;
    type: string;
    updated_at: string;
    updated_by: number;

}   
export interface DocumentSubCategory {
    created_at: string;
    created_by: number;
    description: string;
    document_category_id: number;
    id: number;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
    pivot: {
        document_id: number;
        document_sub_category_id: number;
    }
}

export interface DocumentSubSubCategory{
    created_at: string;
    created_by: number;
    description: string;
    document_sub_category_id: number;
    id: number;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
    pivot: {
        document_id: number;
        document_sub_sub_category_id: number;
    }
}

export interface DocumentType{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
}

export interface Documents{
    created_at: string;
    created_by: number;
    document_id: number;
    ext: number;
    id: number;
    size: string;
    thumbnail_url: string;
    title: string;
    token: string;
    updated_at: string;
    updated_by: number;
    url: string;
    version?:string
    is_latest?: number
}

export interface MsType{
    created_at: string;
    created_by: number;
    id: number;
    is_default: number;
    ms_type_id: number;
    ms_type_version_id: number;
    organization_id: number;
    pivot: { document_id: number; ms_type_organization_id: number;}
    status_id: number;
    updated_at: string;
    updated_by: number;
}

export interface Users{

    assessment_date: number;
    assessment_date_previous: number;
    assessment_score: number;
    assessment_score_previous: number;
    branch_id: number;
    created_at: string;
    created_by: number;
    department_id: number;
    designation_id: 1;
    division_id: number;
    email: string;
    first_name: string;
    id: number;
    image_ext: number;
    image_size: number;
    image_title: number;
    image_token: number;
    image_url: number;
    language_id: number;
    last_name: string;
    mobile: number;
    organization_id: number;
    password_reset_token: number;
    password_reset_token_expiry: number;
    pivot: { document_id: number, user_id: number };
    section_id: number;
    status_id: number;
    sub_section_id: number;
    updated_at: string;
    updated_by: number;
    user_id: number;
}