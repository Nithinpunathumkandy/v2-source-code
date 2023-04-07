export interface ARCI{
    process_id: number,
    accountable_user_ids: number,
    responsible_user_ids: number,
    consulted_user_ids: number,
    informed_user_ids:number
}

export interface ARCIPaginationResponse{
    meta: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    }
    data: ARCIDetails[];
}


export interface ARCIDetails{
    accountable_user: Users[],
    consulted_user: Users[],
    informed_user: Users[],
    process_group: ProcessGroup,
    responsible_user: Users[],
    process_id:number,
    control_id:number,
    title:string
}

export interface Users{
    designation: string,
    email: string,
    first_name: string,
    image: Image,
    last_name:string
}

export interface ProcessGroup {
    created_at:string,
    created_by: number
    description: string,
    id: number,
    status_id: number,
    title: string,
    updated_at: string,
    updated_by: string
}

export interface Image{
    ext: string
    size: number
    thumbnail_url: string
    title: string
    token: string
    url: string
}


