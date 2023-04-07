import { Department } from '../../masters/organization/department';
import { Division } from '../../masters/organization/division';
import { Section } from '../../masters/organization/section';
import { SubSection } from '../../masters/organization/sub-section';
import { CreatedBy } from "../../bpm/controls/controls";
import { Organization } from '../../organization.model';
import { User } from "../../user.model";
import { Branch } from '../../branch.model';

import { ProcessGroup } from '../../bpm/arci/arci';
import { ProcessCategory } from '../../masters/bpm/process-category';
import { Customers } from '../customers/customers';
import { CustomerComplaintSource } from '../../masters/customer-engagement/customer-complaint-source';
import { ComplaintInvestigations } from '../customer-investigation/customer-investigation';
import { ControlTypes } from '../../masters/bpm/contol-types';
import { ControlCategory } from '../../masters/bpm/conrol-category';
import { Location } from '../../masters/general/location';
import { ProductCategory } from '../../masters/organization/product-category';

export interface CustomerComplaint{
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: null
    created_by_last_name: string;
    created_by_status: string;
    customer_complaint_source: string;
    customer_complaint_source_id: number;
    customer_complaint_status_color_code: string;
    customer_complaint_status_id: number;
    customer_complaint_status_title: string;
    customer_complaint_status_type: string;
    customer_complaint_type: string;
    customer_complaint_type_id: number;
    customer_id: number;
    customer_title: string;
    department: string;
    department_id: number;
    description: string;
    designation_id: number;
    designation_title: string;
    division: string;
    division_id: number;
    id: number;
    organization: string;
    organization_id: number;
    receiving_date: string;
    reference_code: string;
    responsible_user_first_name: string;
    responsible_user_id: number;
    responsible_user_image_token: string;
    responsible_user_last_name: string;
    section: string;
    section_id: number;
    sub_section: string;
    branch: string;
    branch_id: number;
    sub_section_id: number;
    title: string;
}

export interface CustomerComplaintPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CustomerComplaint[];
}

export interface IndividualCustomerComplaint {
    branch: Branch[];
    created_at: string;
    created_by: CreatedBy;
    customer: Customers;
    customer_complaint_status: CustomerComplaintStatus
    customer_complaint_type: CustomerComplaintType;
    customer_complaint_source: CustomerComplaintSource;
    department: Department[];
    description: string;
    division: Division[];
    documents: CustomerComplaintDocuments[];
    id: number;
    investigation: ComplaintInvestigations;
    organization: Organization[];
    receiving_date: Date;
    reference_code: string;
    section: Section[];
    sub_section: SubSection[];
    title: string;
    updated_at: string;
    responsible_user: User[];
    is_non_conformity: number;
}

export interface CustomerComplaintType{
    created_at: string;
    created_by: number;
    id: number;
    language: CustomerComplaintTypeLanguage[]
    status_id: number;
    type: string;
}

export interface CustomerComplaintTypeLanguage{
    code: string;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {customer_complaint_type_id: number, language_id: number, title: string}
    status_id: number;
    title: string;
    type: string;
}

export interface CustomerComplaintStatus{
    color_code: string;
    created_at: string;
    created_by: number;
    id: number;
    label: string;
    language: CustomerComplaintStatusLanguage[]
    status_id: number;
    type: string;
}

export interface CustomerComplaintStatusLanguage{
    code: string;
    created_at: string;
    created_by: number;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: {customer_complaint_status_id: number, language_id: number, title: string}
    status_id: number;
    title: string;
    type: string;
}

export interface CustomerComplaintDocuments {
    created_at: string;
    created_by: number;
    customer_complaint_id: number;
    document_id: number;
    ext: string;
    id: number;
    kh_document: any;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    url: string;
}

export interface CustomerComplaintMapping {
    controls: CustomerComplaintControls[];
    customers: CustomerComplaintCustomers[];
    id: number;
    locations: CustomerComplaintLocations[];
    processes:CustomerComplaintProcess[];
    products: CustomerComplaintProducts[];
    projects: CustomerComplaintProjects[];
    strategic_objectives: CustomerComplaintStrategicObjectives[];
    title:string;
}


export interface CustomerComplaintMappingPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: CustomerComplaintMapping[];
}

export interface CustomerComplaintProcess{
    branch_id: number;
    cycle_time: string;
    department:Department;
    department_id: number;
    description: string;
    division_id: number;
    id: number;
    organization_id: number;
    pivot: {customer_complaint_id: number, process_id: number};
    process_category_id: number;
    process_category:ProcessCategory;
    process_group:ProcessGroup;
    process_group_id: number;
    reference_code:number;
    process_owner_id: number;
    scope: string;
    title:string;
}

export interface CustomerComplaintControls{
    comment: string;
    control_category: ControlCategory;
    control_category_id: number;
    control_mode_id: number;
    control_sub_category_id: number;
    control_type: ControlTypes
    control_type_id: number;
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    justify: string;
    method: string;
    pivot: {customer_complaint_id: number, control_id: number}
    reference_code: number;
    status_id: number;
    title: string;
}

export interface CustomerComplaintLocations{
    created_at: string;
    created_by: number;
    id: number;
    pivot: {customer_complaint_id: number, location_id: number}
    status_id: number;
    title: string;
}

export interface CustomerComplaintProjects{
    created_at: string;
    created_by: number;
    customer_id: number;
    description: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    location: Location
    location_id: number;
    member_count: number;
    pivot: {customer_complaint_id: number, project_id: number}
    project_manager: User
    project_manager_id: number;
    project_status_id: number;
    project_type_id: number;
    start_date: string;
    target_date: string;
    title: string;
}

export interface CustomerComplaintProducts{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    pivot: {customer_complaint_id: number, product_id: number}
    product_category: ProductCategory;
    product_category_id: number;
    reference_code: string;
    status_id: number;
    sub_title: string;
    title: string;
}

export interface CustomerComplaintCustomers{
    address: string;
    contact_person: string;
    contact_person_email: string;
    contact_person_number: string;
    contact_person_role: string;
    created_at: string;
    created_by: number;
    email: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    mobile: string;
    pivot: {customer_complaint_id: number, customer_id: number}
    reference_code: string;
    status_id: number;
    title: string;
    website: string;
}

export interface CustomerComplaintStrategicObjectives{
    created_at: string;
    created_by: number;
    description: string;
    id: number;
    pivot: {customer_complaint_id: number, strategic_objective_id: number}
    status_id: number;
    title: string;
}

