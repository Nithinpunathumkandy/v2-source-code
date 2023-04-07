export interface AccessSettings{
    id:number;
    organization_title:string;
    branches:Branch[];
    is_accordion_active:boolean;
    is_enabled:boolean;
    organizations:Organization[];
    organization:Organizations[];
    ms_types:MsType[]
    
}

export interface Branch{
    id:number;
    branch_title:string;
    is_enabled:boolean;
    is_accordion_actve:boolean;
   
}

export interface Organization{
    id:number;
    title:string;
    branches:Branch[];
    is_accordion_active:boolean;
    is_enabled:boolean;
}

export interface Organizations{
    id:number;
    organization_title:string;
    divisions:Division[];
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