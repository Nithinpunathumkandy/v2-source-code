export interface Customers{
    id: number;
    reference_code: number;
    title: string;
    image_title: string,
    image_url: string,
    image_token: string,
    image_size: number,
    image_ext : string,
    mobile: string;
    email: string;
    website: string;
    contact_person: string;
    contact_person_role: string;
    contact_person_number: string;
    contact_person_email: string;
    address: string;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    status_id: number;
    status: string;
    created_by_first_name: string;
    created_by_last_name: string;
}

export interface CustomerResponse{
    current_page: number;
    data: Customers[];
    per_page: number;
    total: number;
    from: number;
}

export interface CustomerDetails{
    id: number,
    title: string,
    logo_url: string,
    mobile: string,
    email: string,
    website: string,
    contact_person: string,
    contact_person_role: string,
    contact_person_number: string,
    contact_person_email: string,
    address: string,
    created_at: string,
    updated_at: string,
    image_title: string,
    image_url: string,
    image_token: string,
    image_size: number,
    image_ext : string,
    created_by: {
        id: number,
        name: string, 
        email: string, 
        image_url: string, 
        designation: string
    },
    updated_by: {
        id: number, 
        name: string, 
        email: string, 
        image_url: string, 
        designation: string
    },
    status: {
        id: number, 
        title: string, 
        label: string
    }
}