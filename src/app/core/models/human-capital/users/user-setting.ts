export interface Integration {
    id: number;
    logo_url: string;
    redirect_url: string;
    type_group:string;
    type: string;
    is_user_authorized: boolean;
    
}

export interface Acl{
    id:number;
    title:string;
    modules:Module[];
    is_enabled:boolean;
    module_group: string;
    module_group_id: number;
}

export interface Access{
    id:number;
    organization_title:string;
    branches:Branch[];
    is_accordion_active:boolean;
    is_enabled:boolean;
    organizations:Organization[];
    organization:Organizations[];
    ms_types:MsType[]
    
}

export interface Organization{
    id:number;
    title:string;
    branches:Branch[];
    is_accordion_active:boolean;
    is_enabled:boolean;
}

export interface MsType{
    id:number;
    title:string;
    is_enabled:boolean;
    ms_type_organization_id:number;
    ms_type_version_title:string;
}

export interface Branch{
    id:number;
    branch_title:string;
    is_enabled:boolean;
    is_accordion_actve:boolean;
   
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

export interface Organizations{
    id:number;
    organization_title:string;
    divisions:Division[];
    is_accordion_active:boolean;
    is_enabled:boolean;
}

export interface Division{
    id:number;
    division_title:string;
    departments:Department[];
    is_enabled:boolean;
}

export interface Department{
    id:number;
    department_title:string;
    sections:Section[];
    is_enabled:boolean;
}

export interface Section{
    id:number;
    section_title:string;
    sub_sections:SubSection[];
    is_enabled:boolean;
}

export interface SubSection{
    id:number;
    sub_section_title:string;
    is_enabled:boolean;
}

export interface EmailNotification{
    is_enabled:boolean;
    module_groups:ModuleGroup[];
    
}

export interface ModuleGroup{
    module_group:string;
    module_group_id:number;
    is_enabled:boolean;
    notifications:Notification[];
}

export interface Notification{
    id:number;
    app_notification_id:number;
    title:string;
    code:string;
    is_enabled:boolean;
}

export interface Settings{

    default_language_id:number;
    timezone_id:number;
    is_autolock: boolean;
    autolock_seconds: number;
}

export interface AccessibleOrganizationLevels{
    id: number;
    is_enabled: boolean;
    title: string;
}

