export interface KhCheckList {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    ms_type_organization_id:number;
}

export interface KhCheckListPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KhCheckList[];
}