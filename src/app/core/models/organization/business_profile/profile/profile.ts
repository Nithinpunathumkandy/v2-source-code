import { Image } from '../../../image.model';
import { GeneralUser } from '../../../general/general-user';
import { Status } from '../../../status.model';
import { UpdatedBy } from '../../../general/updated_by';
import { SocialNetwoks } from '../../../general/social-network-sites';

export interface ProfileDetails {
    id: number,
    title: string,
    description: string,
    image_title: string,
    image_url: string,
    image_token: string,
    image_size: string,
    image_ext: string,
    values: string,
    is_primary: number,
    vision: string,
    mision: string,
    ceo_user_id: number,
    ceo_message: string,
    employee_count: string,
    branch_count: number,
    establish_date: Date,
    phone: string,
    address: string,
    website: string,
    brouchure_url: string,
    email: string,
    brouchure_thumbnail_url: string,
    ceo_first_name: string,
    ceo_last_name: string
}

export interface Profile{
    id: number,
    title: string,
    description: string,
    image: Image,
    logo_url: string,
    values: string,
    is_primary: number,
    vision: string,
    mision: string,
    ceo: GeneralUser,
    ceo_message: string,
    employee_count: number,
    branch_count: number,
    establish_date: string,
    phone: string,
    email: string,
    address: string,
    website: string,
    brouchures: Image[],
    created_at: string,
    updated_at: string,
    created_by: GeneralUser,
    updated_by: GeneralUser,
    status: Status,
    brouchure_url: string,
    brouchure_thumbnail_url: string,
    organization_sns: SocialNetwoks
}