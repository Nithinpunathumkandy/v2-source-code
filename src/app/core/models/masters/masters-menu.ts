export interface MasterModules{
    client_side_url: string;
    id: number;
    modules: MasterSubModules[];
    title: string;
}

export interface MasterSubModules{
    client_side_url: string;
    module_id: number;
    title: string;
}

export interface SubModulesSearchResult{
    client_side_url: string;
    module_id: number;
    title: string;
    module_group_id: number;
    module_group_title: string;
}