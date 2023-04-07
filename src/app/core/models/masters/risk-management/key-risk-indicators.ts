export interface KeyRisk {
    id: number;
    title: string;
    description:string;
    risk_category_id:number;
    unit:any;
    unit_title:any
    unit_id:number;
    status: string;
    status_id :number;
    status_label: string;
    risk_category:any;
}
export interface KeyRiskPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: KeyRisk[];
}