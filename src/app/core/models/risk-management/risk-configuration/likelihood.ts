export interface Likelihood{
    id:number;
    score:number;
    probability:string;
    languages:Languages[];
    language:Languages[];
    risk_matrix_likelihood_title: string;

}

export interface IndividualLikelihood{
    id:number;
    probabaility:string;
    score:number;
    languages:Languages[]

}

export interface LikelihoodPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:Likelihood[];
}

export interface Languages{
    id:number;
    title:string;
    pivot:Pivot;
}

export interface Pivot{
    language_id:number;
    risk_matrix_likelihood_id:number;
    title:string;
    timeframe:string;
}