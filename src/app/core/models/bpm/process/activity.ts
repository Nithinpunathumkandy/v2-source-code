export interface ActivityPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: Activity[];
}

export interface Activity {
    id:number,
    designation_id: number,
    previous_process_activity_id: number,
    accountable_user_id: number,
    responsible_user_ids: [number],
    title: string,
    description: string,
    activity_input: string,
    activity_output: string,
    process_activity_documents: Documents[],
    is_accordion_active?: boolean;
}

export interface ActivityDetails {
    id: number,
    title:string,
    accountable_user: AccountableUser
    activity_input: string,
    activity_output: string,
    created_at: string,
    process_id:number,
    created_by:CreatedBy
    description: string,
    designation: {
        title: number,
        id:number
    },
    responsible_user: ResponsibleUser[],
    documents: Documents[],
    previous_process_activity: {
        id: number,
        title: string,
        previous_process_activity_id:number
    }

}

export interface ResponsibleUser{
    designation: string,
    email: string,
    first_name: string,
    image: Image,
    last_name:string,
    id:number
}



export interface AccountableUser{
    id: number;
    designation: string,
    email: string,
    first_name: string,
    last_name:string,
    image: Image,
   
}
export interface CreatedBy{
    id: number, 
    first_name: string, 
    last_name: string, 
    email: string, 
    image_url: string, 
    designation: string,
    image: Image
}

export interface Image{
    ext: string
    size: number
    thumbnail_url: string
    title: string
    token: string
    url: string
}

export interface Documents{
    id:number,
    name: string,
    ext: string,
    title:string,
    mime_type: string,
    size: number,
    url: string,
    thumbnail_url: string,
    token:string
    
}