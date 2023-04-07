import { Organization } from '../../organization.model';
import { Division } from '../../division.model';
import { CreatedBy } from '../../bpm/process/processes';
import { Status } from '../../status.model';

import { Head } from "./department";
import { Department } from '../../department.model';

export interface Section {
    id: number;
    title: string;
    organization_id: number;
    department_id: number;
    head_designation: string;
    head_first_name: string;
    head_id: number;
    head_image_token: string;
    head_last_name: string;
    code: string;
    status_id :number;
    status_label: string;
    division_id: number;
    division_title: string;
    color_code: string;
}
export interface SectionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Section[];
}

export interface SectionDetails {
    created_at: string;
    created_by: CreatedBy;
    division: Division;
    department: Department;
    head: Head;
    id: number;
    organization: Organization;
    status: Status;
    title: string;
    code: string;
    order: number;
    color_code: string;
    users:any
    department_users: any;
}