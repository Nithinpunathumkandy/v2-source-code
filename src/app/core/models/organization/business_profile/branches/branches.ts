import { Image } from '../../../image.model';
import { Status } from '../../../status.model';
import { GeneralUser } from '../../../general/general-user';

export interface Branch {
    id: number,
    title: string,
    organization_id: number,
    description: string,
    image_title: string,
    image_url: string,
    image_token: string,
    image_size: string,
    image_ext: string,
    employees_count: string,
    establish_date: Date,
    phone: string,
    email: string,
    organization_title: string,
    status_id: number
}

export interface BranchDetails{
    id: number,
    organization: {
        id: number,
        title: string,
        description: string,
        logo_url: string,
        is_primary: number,
        establish_date: string,
        phone: string,
        address: string,
        website: string
    },
    title: string,
    description: string,
    image: Image,
    establish_date: string,
    employees_count: number,
    phone: string,
    email: string,
    address: string,
    created_at: string,
    updated_at: string,
    created_by: GeneralUser,
    updated_by: GeneralUser,
    status: Status,
    view_more : boolean,
    branch_manager: {
        department: string,
        designation: string,
        email: string,
        first_name: string
        id: number,
        image: Image,
        last_name: string,
        mobile:number,
      }
}