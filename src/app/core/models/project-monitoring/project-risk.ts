export interface RiskPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Risks[];
}

export interface Risks {
    id:number;
    title:string;
    risk_rating_id:number;
    risk_resolving_plan:string;
    risk_rating_values:any;
    label:string;
 
}