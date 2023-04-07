import { GeneralUser } from '../../general/general-user';

export interface BusinessServices {
    // id: number,
    // service_category: ServiceCategory,
    // title: string,
    // description: string,
    // service_items: [],
    // status: ServiceStatus,
    // updated_by : GeneralUser,
    // created_by : GeneralUser,
    // updated_at : string,
    // created_at : string,
    description: string;
    id: number;
    service_category: ServiceCategory;
    service_category_title: string;
    service_item_title: string;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
    service_items: string[],
}

export interface BusinessServiceDetails {
    description: string;
    id: number;
    service_category: ServiceCategory;
    service_items: ServiceItems[];
    title: string;
}

export interface ServiceItems {
    id: number;
    service_id: number;
    title: string;
}

export interface BusinessServiceCategories {
    id: number,
    title: string,
    created_by: number,
    status_id: number,
    services: string,
    status: string,
}

export interface ServiceCategory {
    id: number,
    title: string
}

export interface ServiceStatus {
    id: number,
    title: string,
    label: string
}

export interface ServicesPaginatedResponse {
    data: BusinessServices[],
    current_page: number,
    per_page: number,
    total: number,
    from: number
    // meta: {
    //     current_page: number,
    //     per_page: number,
    //     total: number,
    //     from: number
    // }
}