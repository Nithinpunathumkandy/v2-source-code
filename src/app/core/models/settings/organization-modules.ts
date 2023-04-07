export interface OrganizationModuleGroup{
    active: number;
    id: number;
    inactive: number;
    modules: OrganizationModules[];
    isEnabled: boolean;
    client_side_url: string;
    icon: string;
    is_menu: number;
    order: number;
    title: string;
}

export interface OrganizationModules{
    active: number;
    inactive: number;
    module_id: number;
    title: string;
    isEnabled: boolean;
    client_side_url: string;
    is_menu: number;
    order: number;
    sub_menus: SubMenus[];
}

export interface SubMenus{
    active: number;
    inactive: number;
    module_id: number;
    title: string;
    client_side_url: string;
    is_menu: number;
    order: number;
}

export interface ModuleGroupsResponse {
    data:Modules[]
}

export interface Modules {
    module_id: number;
    module: string;
}


export interface Labels{
    id: number;
    status: string;
    title;
}