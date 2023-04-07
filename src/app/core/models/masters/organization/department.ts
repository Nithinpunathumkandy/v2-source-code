import { Organization } from '../../organization.model';
import { Image } from '../../image.model';
import { Division } from '../../division.model';
import { CreatedBy } from '../../bpm/process/processes';
import { Status } from '../../status.model';

export interface Department {
    division_id: number;
    division_title: string;
    head_designation: string;
    head_first_name: string;
    head_id: number;
    head_image_token: string;
    head_last_name: string;
    id: number;
    organization_id: number;
    organization_title: string;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
    is_selected:any;

}
export interface DepartmentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Department[];
}

export interface Head {
    id: number;
    first_name: string;
    email: string;
    last_name: string;
    image: Image;
    designation: string;
}

export interface DepartmentDetails{
    created_at: string;
    created_by: CreatedBy;
    division: Division;
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

