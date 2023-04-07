import { CreatedBy } from '../../human-capital/users/user-document';
import { Department, Division, Organization, Section, Subsection } from '../../human-capital/users/users';
import { Language } from '../../knowledge-hub/documents/documentDetails';
import { MsType } from '../../organization/business_profile/ms-type/ms-type';

export interface Assessments{
    id:number;
    score:number;

}

export interface IndividualAssessment{
    id:number;
    reference_code:string;
    description:string
    score:number;
    title:string;
    created_by:CreatedBy;
    business_assessment_framework:Options;
    business_assessment_framework_id:number;
    business_assessment_status:Status;
    organizations:Organization[];
    divisions:Division[];
    departments:Department[];
    sections:Section[];
    sub_sections:Subsection[];
    document:Document;
    ms_type_organizations:MsType[];
    version:string;
    created_at:string;
    document_contents:Contents[];
    document_version:Version;
    total_checklist_count:number;
    answered_checklist_count:number;

}

export interface AssessmentPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:Assessments[];
}

export interface Contents{
    business_assessment_id:number;
    document_version_content_id:number;
    document_version_content:versionContent;
    document_version_parent_content_id:number;
    id:number;
    score:number;
    child:Child[];
    is_completed:number;

}

export interface versionContent{
    clause_number:string;
    created_at:string;
    description:string;
    title:string;
    id:number;
}


export interface Options{
    id:number;
    title:string;
    score:number;
    description:string;
    
}

export interface Status{
    id:number;
    status_id:number;
    type:string;
    title:string;
    language:Language[];

}

export interface Document{
    id:number;
    versions:Version[];
}

export interface Version{
    id:number;
    title:string;
    token:string;
    ext:string;
    version:string;
    document_id:number;
    size:number;
}

export interface Checklist{
    id:number;
    title:string;
    checklist:checklistContent;
    document_version_content:ChecklistVersionContent;
    business_assessment:BusinessAssessment;
    documents:Documents[];
    children:Child[];
    
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
    business_assessment_document_content_checklist_id:number;
}

export interface checklistContent{
    id:number;
    title:string;
}

export interface ChecklistVersionContent{
    child:Child;
}

export interface Child{
    clause_number:number;
    title:string;
}

export interface BusinessAssessment{
    business_assessment_framework:Framework;
}

export interface Framework{
    business_assessment_framework_options:FrameworkOption;
}

export interface FrameworkOption{
    title:string;
}


