export interface AclRole {
    id: number;
    user_id: number;
    title: string;
    type: string;
    description:string;
   
}

export interface AclRolePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: AclRole[];
}

export interface Acl{
    id:number;
    title:string;
    modules:Module[];
    is_enabled:boolean;
    module_group: string;
    module_group_id: number;
}

export interface Module{
    module_id:number;
    module:string;
    is_enabled:boolean;
    activity_type_groups:activity_type_group[];
}

export interface activity_type_group{
    module_id:number;
    module:string;
    is_enabled:boolean;
    activities:Activity[];
}

export interface Activity{
    activity_id:number;
    activity_title:string;
    activity_type:string;
    activity_type_id:number;
    activity_type_title:string;
    is_enabled:boolean;
}

