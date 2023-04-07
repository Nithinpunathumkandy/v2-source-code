import { Organization } from '../../organization.model';
import { Image } from '../../image.model';
import { CreatedBy } from '../../general/created_by';

export interface DivisionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Division[];
}

export interface Division {
    id: number;
    title: string;
    organization_id: number;
    head_id: number;
    organization:Organization;
    head:Head;
    status_id :number;
    status_label: string;
    created_at: string;
    created_by:CreatedBy;
    departments:Departments[];
    status:Status;
    users:Users[];
}

export interface Users{
    id:number;
}

export interface Departments{
    code:string;
    id:number;
    title:string;
}
export interface Head {
    id: number;
    first_name: string;
    email: string;
    last_name: string;
    image: Image;
    designation: string;

}

export interface Status{
    id:number;
    label:string;
    title:Title[];
}

export interface Title{
    pivot:Pivot;
}

export interface Pivot{
    id:number;
    title:string;
}
