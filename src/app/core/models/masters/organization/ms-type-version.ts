export interface MsTypeVersion {
    id: number;
    title: string;
    ms_type_id:number;
    status_id :number;
    status_label: string;
}

export interface MsTypeVersionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from : number;
    data: MsTypeVersion[];
}

export interface MsTypeVersionSaveResponse {
    id: number;
    message: string;
}

export interface AvailableMsTypeVersions{
    ms_type_verion_id: number;
    ms_type_verion_title: string;
}