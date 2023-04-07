export interface Impact{
    id:number;
    score:number;
    probability:string;
    languages:Languages[];
    language:Languages[];
    risk_matrix_impact_title: string;

}

export interface IndividualImpact{
    id:number;
    probabaility:string;
    score:number;
    languages:Languages[];
}

export interface ImpactPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:Impact[];
}

export interface Languages{
    id:number;
    title:string;
    pivot:Pivot;

}

export interface Pivot{
    language_id:number;
    risk_matrix_impact_id:number;
    title:string;
    description:string;
}