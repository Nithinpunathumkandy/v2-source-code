export interface BusinessApplications {
    id: number;
    title: string;
    description: string;
    businessApplicationType:{
        id:number;
    }
    // business_application_type_title:{
    //     id:number
    // }
    supplier:{
        id: number;
    }
    supplier_title: string;
    amc_start: number;
    amc_end: number;
    status_id: number;
    quantity: number
    is_amc: number;
    image_token:string;
    status_label: string;
    status: string;
}
export interface BusinessApplicationsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BusinessApplications[];
}