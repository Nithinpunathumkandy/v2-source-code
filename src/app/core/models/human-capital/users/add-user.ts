export interface AddUser {
    id: number;
    image_url:string;
    first_name: string;
    last_name:string;
    email:string;
    mobile:number;
    subsidiary_id:string;
    branch_id:string;
    department_id:string;
    division_id:string;
    section_id:string;
    sub_section_id:string;
    designation_id:string;
    password:string;
    addresses:Address[];
    
   
    super_admin:boolean;
    employee:boolean;
    audit_manager:boolean;
}

export interface Address{
    contact:Contact[];
    emergency:Emergency[];
}

export interface Contact{
    address:string;
    street:string;
    state:string;
    city:string;
    country:string;
    zip:string;
}

export interface Emergency{
    relative_name:string;
    relationship:string;
    relative_mobile:number;
    relative_address:string;
}


