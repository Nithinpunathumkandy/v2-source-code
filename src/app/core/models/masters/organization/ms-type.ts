export interface MsType {
    id: number;
    title: string;
    code:string;
    description: string;
    status_id :number;
    status_label: string;
}

export interface MsTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsType[];
}

export interface MsTypeSaveResponse {
    id: number;
    message: string;
}

export interface AvailableMsTypes{
    ms_type_id: number;
    ms_type_title: string;
}