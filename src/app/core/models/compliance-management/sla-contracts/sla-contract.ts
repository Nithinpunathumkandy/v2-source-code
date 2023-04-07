import { CreatedBy } from "../../bpm/controls/controls";
import { Branch } from "../../branch.model";
import { Division } from "../../division.model";
import { SubSection } from "../../general/sub-section";
import { Image } from "../../image.model";
import { organizations } from "../../internal-audit/audit-workflow/audit-workflow";
import { SlaCategory } from "../../masters/compliance-management/sla-category";
import { Departments } from "../../mrm/mrm-workflow/mrm-workflow";
import { Products } from "../../organization/business_profile/business-products";
import { Section } from "../../section.model";
import { Status } from "../../status.model";
import { SLAWorkflowItem } from "../compliance-workflow/sla-contract-workflow";

export interface SLAContracts{
    description: string;
    id: number;
    title: string;
    departments: string;
    divisions: string;
    document_responsible_user: string;
    document_type_id: number;
    document_type_title: string;
    expiry_date: string;
    issue_date: string;
    reference_code: string;
    sla_category_id: number;
    sla_category_title: string;
    client: string;
    product_title: string;
    sla_status_id: number;
    sla_status_label: string;
    sla_status_title: string;
}

export interface SLAContractsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: SLAContracts[];
}

export interface IndividualSLAContracts {
    branches: Branch[];
    client: string;
    compliance_responsible_users: SLAResponsibleUser[];
    created_at: string;
    created_by: CreatedBy;
    departments: Departments[]
    description: string;
    divisions: Division[];
    id: number;
    is_expired: boolean;
    next_review_user_level: number;
    no_of_days: number;
    organizations: organizations[];
    product: Products;
    reference_code: string;
    renewed_count:number;
    sections: Section[]
    sla_category: SlaCategory;
    sub_sections: SubSection[];
    submitted_by: SLAResponsibleUser;
    title: string;
    versions:versions[];
    workflow_items: SLAWorkflowItem[];
    contract_value: string;
}

export interface versions{
    document_id: number;
    expiry_date: string;
    ext: string;
    id: number;
    is_latest: number;
    issue_date: string;
    size: number;
    thumbnail_url: string;
    token: string;
    url: string;
    title:string;
    version: string;
    sla_status : {
        id: number
        label: string
        language:slaLanguage[];
        type : string;
    }
}

export interface slaLanguage{
    status_id: number;
    type:string;
}

export interface SLAResponsibleUser{
    designation: string,
    email: string,
    first_name: string,
    image: Image,
    last_name: string,
    id: number,
    department: string;
    mobile: any,
    status: Status
}
