export interface MsAuditStatuses {
    id: number;
    title: string;
    label:string;
    color_code:string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface MsAuditStatusesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditStatuses[];
}
// export interface MsAuditModeSingle {
//     id: number;
//     type:string;
//     label:string;
//     color_code:string;
// }