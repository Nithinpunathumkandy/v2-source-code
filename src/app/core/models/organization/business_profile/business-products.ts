import { Image } from '../../image.model';
import { GeneralUser } from '../../general/general-user';
import { Status } from '../../status.model';

export interface Products{
    description: string;
    id: number;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    product_catalogue_ext: string;
    product_catalogue_size: string;
    product_catalogue_thumbnail_url: string;
    product_catalogue_title: string;
    product_catalogue_token: string;
    product_catalogue_url: string;
    product_category_title: string;
    product_catalogue_id: string;
    reference_code: string;
    status: string;
    status_id: number;
    status_label: string;
    sub_title: string;
    title: string;
}

export interface ProductCategories{
    id: number,
    title: string,
    created_by: number,
    status_id: number,
    products: string,
    status: string,
}

export interface ProductDetails{
    id: number,
    product_category: {
        id: number,
        title: string,
        created_at: string,
        updated_at: string,
        created_by: GeneralUser,
        updated_by: GeneralUser[],
        status: Status
    },
    title: string,
    sub_title: string,
    description: string,
    image: Image,
    catelogues: any []
    created_at: string,
    updated_at: string,
    created_by: GeneralUser,
    updated_by: GeneralUser [],
    status: Status
    // description: string;
    // id: number;
    // image_ext: string;
    // image_size: number;
    // image_title: string;
    // image_token: string;
    // image_url: string;
    // product_catalogue_ext: string;
    // product_catalogue_size: string;
    // product_catalogue_thumbnail_url: string;
    // product_catalogue_title: string;
    // product_catalogue_token: string;
    // product_catalogue_url: string;
    // product_category_title: string;
    // reference_code: string;
    // status: string;
    // status_id: number;
    // status_label: string;
    // sub_title: string;
    // title: string;
}

export interface ProductsPaginatedResponse{
    data: Products[],
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