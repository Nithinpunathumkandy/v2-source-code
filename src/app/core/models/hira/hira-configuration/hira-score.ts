export interface HiraScore{
    likelihood:Likelihood[];
}

export interface Likelihood{
    impact:Impact[]
}

export interface Impact{
    impact_id:number;
    likelihood_id:number;
    score:number;
    rating:Rating;
}

export interface Rating{
    color:string;
    rating_level:RatingLevel[];
}

export interface RatingLevel{
    id:number;
    title:string;
    pivot:Pivot;
}

export interface Pivot{
    risk_rating_id:number;
    title:string;
}