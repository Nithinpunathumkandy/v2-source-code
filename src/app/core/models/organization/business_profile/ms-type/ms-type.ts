import { GeneralUser } from '../../../general/general-user';

export interface MsType {
    id: number
    ms_type_id: number
    organization_id: number
    ms_type_version_id: number
    is_default: number
    created_at: string
    updated_at: string
    created_by: number
    updated_by: string
    status_id: number
    ms_type_description: string
    ms_type_title: string
    ms_type_code: string
    ms_type_version_title: string
    organization_title: string
    status: string
    created_by_first_name: string
    created_by_last_name: string
    updated_by_first_name: string
    updated_by_last_name: string
    ms_type:{  
        title: string,
    };
}

export interface MsTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: MsType[];
}

export interface MsTypeDetails{
    id: number,
    description: string;
    ms_type:{
        id: number,
        code: string,
        title: string,
        description: string,
        created_at: string,
        updated_at: string,
        created_by: number,
        updated_by: number,
        status_id: number,
    },
    ms_type_version:{
        id: number,
        ms_type_id: number,
        title: string,
        created_at: string,
        updated_at: string,
        created_by: number,
        updated_by: number,
        status_id: number,
    },
    organization:{
        id: number,
        title: number,
        description: string,
        logo_url: string,
        is_primary: number,
        establish_date: string,
        phone: string,
        address: string,
        website: string,
    },
    created_at: string,
    updated_at: string,
    created_by: GeneralUser,
    updated_by: GeneralUser,
    status: {
        id: number,
        title: string,
        label: string
    }
    documents: Documents[];
    exclusions_and_justifications: string;
    kh_document: KHDoc[];
    sa1_date: string;
    sa2_date: string;
}

export interface KHDoc{
    versions: Versions[];
}

export interface Versions{
    id: number,
    document_id: number,
    title: string,
    score: number,
    ext: string,
    size: number,
    token: string,
    url: string,
    thumbnail_url: string,
    version: number,
    is_latest: boolean
}

export interface AllMsTypeDetails{
    organization:{
        id: number,
        title: number,
        description: string,
        image_ext: string,
        image_size: number,
        image_title: string,
        image_token: string,
        image_url: string,
        is_primary: number,
        establish_date: string,
        phone: string,
        address: string,
        website: string,
    },
    ms_types: MsTypes[]
}

export interface MsTypes{
    ms_type_details: {
        code: string;
        description: string;
        id: number;
        status_id: number;
        title: string;
    },
    ms_type_version:{
        is_default: number;
        ms_type_version_details:{
            id: number;
            ms_type_id: number;
            status_id: number;
            title: string;
        };
        ms_type_organization_id: number;
    }[]
}

export interface ms_type{
    
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_job_id:string;
}