import { CreatedBy } from '../../../bpm/process/processes';
import { Brochure } from '../../../brochure.modal';

export interface Policies {
    id: number,
    organization_id: number,
    title: string,
    description: string,
    organization_title: string
}

export interface PolicyDetails{
    id: number;
    organization:{
        id: number;
        title: string;
        description: string;
        logo_url: string;
        is_primary: number;
        establish_date: string;
        phone: string;
        address: string;
        website: string;
    };
    title: string;
    description: string;
    documents: Brochure[];
    created_by: CreatedBy;
    created_at: string;
}

export interface PolicyPaginationResponse{
    current_page: number;
    data: Policies[];
    per_page: number;
    total: number;
    last_page: number;
}