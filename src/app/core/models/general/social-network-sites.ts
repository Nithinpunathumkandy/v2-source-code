import { GeneralUser } from './general-user';

export interface SocialNetwoks{
    created_at: string,
    created_by: GeneralUser,
    facebook: string,
    id: number,
    instagram: string,
    linkedin: string,
    organization_id: number,
    skype: string,
    status_id: number,
    twitter: string,
    updated_at: string,
    updated_by: GeneralUser,
    youtube: string,
}