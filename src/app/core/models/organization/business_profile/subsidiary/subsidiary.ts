import { Brochure } from '../../../brochure.modal';
import { GeneralUser } from '../../../general/general-user';
import { Image } from '../../../image.model';
import { Status } from '../../../status.model';
import { SocialNetwoks } from '../../../general/social-network-sites';
import { User } from '../../../user.model';

export interface Subsidiary {
    id: number,
    title: string,
    description: string,
    image_title: string,
    image_url: string,
    image_token: string,
    image_size: number,
    image_ext : string,
    values: string,
    is_primary: number,
    vision: string,
    mision: string,
    ceo: string,
    ceo_message: string,
    employee_count: string,
    branch_count: string,
    establish_date: Date,
    phone: string,
    website: string,
    brouchure_url: string,
    email: string,
    youtube: string,
    twitter: string,
    skype: string,
    facebook: string,
    instagram: string,
    linkedin: string,
    status_id: number
}

export interface SubsidiaryDetails{
    id: number,
    title: string,
    description: string,
    image: Image
    values: string,
    is_primary: number,
    vision: string,
    mision: string,
    ceo: string,
    ceo_message: string,
    employee_count: string,
    branch_count: string,
    establish_date: Date,
    phone: string,
    website: string,
    brouchures: Brochure[],
    email: string,
    created_at: string,
    updated_at: string,
    created_by: number,
    updated_by: GeneralUser,
    status: Status,
    organization_sns: SocialNetwoks,
    view_more: boolean
    subsidiary_head: User
}