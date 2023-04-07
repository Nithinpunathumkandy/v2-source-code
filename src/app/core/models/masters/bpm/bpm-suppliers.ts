import { Image } from "../../image.model";

export interface BpmSuppliers{
    id:number;
    status_id :number;
    title:string;
    mobile: number;
    email: string;
    website:string;
    address: string;
    contact_name: string;
    contact_role:string;
    contact_number:number;
    contact_email:string;
    contact_address:string;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;

}
export interface BpmSuppliersPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BpmSuppliers[];
}
export interface IndividualSuppliers{
    id:number;
    status_id :number;
    title:string;
    mobile: number;
    email: string;
    website:string;
    address: string;
    contact_name: string;
    contact_role:string;
    contact_number:number;
    contact_email:string;
    contact_address:string;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;

}