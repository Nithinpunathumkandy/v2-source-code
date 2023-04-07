import { CreatedBy } from "../../bpm/controls/controls";
import { Branch } from "../../branch.model";
import { Department } from "../../department.model";
import { Division } from "../../division.model";
import { ComplianceArea } from "../../masters/compliance-management/compliance-area";
import { ComplianceFrequency } from "../../masters/compliance-management/compliance-frequency";
import { ComplianceSection } from "../../masters/compliance-management/compliance-section";
import { ComplianceType } from "../../masters/compliance-management/compliance-type";
import { Organization } from "../../organization.model";
import { Products } from "../../organization/business_profile/business-products";
import { Section } from "../../section.model";
import { SubSection } from "../../sub-section.model";
import { WorkflowItems } from "../compliance-workflow/compliance-workflow";
import { Image } from "../../image.model";

export interface ComplianceRegister {
    comment: string;
    compliance_frequency_id: number;
    compliance_frequency_title: string;
    compliance_frequency_type: string;
    compliance_source: string;
    compliance_status_id: number
    compliance_status_label: string;
    compliance_status_title: string;
    created_at: string;
    created_by: number
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    departments: string;
    description: string;
    document_compliance_status_updates:ComplianceStatus;
    document_version:expiryDate[];
    document_compliance_area: string;
    document_compliance_document_type: string;
    document_compliance_section: string;
    document_responsible_user: string;
    document_type_id: number
    document_type_title: string;
    document_version_id: number
    document_version_title: string;
    expiry_date: string;
    ext: string;
    id: number
    is_latest: number
    issue_authority: string;
    issue_date: string;
    product_title: string;
    reference_code: string;
    size: number
    thumbnail_url: string;
    title: string;
    token: string;
    url: string;
    version: string;
}

export interface expiryDate{
    expiry_date:string;
}
export interface ComplianceRegisterPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ComplianceRegister[];
}

export interface ComplianceRegisterDetails {
    branches: Branch[];
    comment: string;
    compliance_areas: ComplianceArea[];
    compliance_document_types: ComplianceType[];
    compliance_frequency: ComplianceFrequency[];
    compliance_responsible_users:ResponsibleUsers[];
    compliance_sections: ComplianceSection[];
    compliance_source: string;
    created_at: string;
    created_by: CreatedBy;
    departments: Department[];
    description : string;
    divisions: Division[];
    document_compliance_status_updates:ComplianceStatus[] //
    id: number;
    issue_authority: ResponsibleUsers;
    next_review_user_level: number;
    organizations: Organization[];
    product: Products;
    reference_code : string;
    sections: Section[];
    sub_sections: SubSection[];
    submitted_by: ResponsibleUsers
    title: string;    
    versions: Version[];
    workflow_items: WorkflowItems[];
    review_user: ResponsibleUsers;
    sa1: string;
    sa2: string;

}

export interface Version {
    document_id: number
    expiry_date: string
    ext: string
    id: number
    is_latest: number
    issue_date: string
    size: number
    thumbnail_url: string
    title: string
    token: string
    url: string
    version: string
}

export interface ComplianceStatus {
    comment: string
    compliance_status: {
        id: number
        label:any
        language: StatusLanguage[]
    }
    language: StatusLanguage[]
    compliance_status_id: number
    created_at: string
    created_by: number
    document_id: number
    documents: any
    id: number
    is_latest: number
}
export interface StatusLanguage{
    pivot: {
        compliance_status_id:number,
        language_id: number,
        title: string
    }
}

export interface ResponsibleUsers{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status?:{
        id:number;
    }
    designation: string,
    image_token?: string;
    image?:Image
  }

export interface StatusHistory{
    comment: string
    compliance_status_id: number
    compliance_status_title: string
    created_at: string
    created_by: number
    created_by_department: string
    created_by_designation: string
    created_by_first_name: string
    created_by_image_token: string
    created_by_last_name: string
    created_by_status: string
    documents: any
    id: number
    is_latest: number
    updated_at: string
    updated_by: number
    updated_by_department: string
    updated_by_designation: string
    updated_by_first_name: string
    updated_by_image_token: string
    updated_by_last_name: string
    updated_by_status: string
}
export interface ComplianceStatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StatusHistory[];
}
