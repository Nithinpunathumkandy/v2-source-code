
export interface AuditChecklistGroup{
    id:number;
    status_id :number;
    title:string;
    status: string;
    status_label:string
}
export interface AuditChecklistGroupPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditChecklistGroup[];
}
export interface AuditChecklistGroupSingle {
    id: number;
    title:string;
}