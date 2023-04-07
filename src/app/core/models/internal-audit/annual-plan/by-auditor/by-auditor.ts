export  interface ByAuditor{
    id:number;
    plans :number;
    audits:number;
    findings:number;
    designation_id: number;
    designation_title: string;
    first_name:string;
    last_name:string;
    user_id:number;
    image_token:string;
}

export interface ByAuditorPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data:ByAuditor[]
}