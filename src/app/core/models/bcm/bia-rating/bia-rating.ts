export interface BiaRating{
id: number;
level: string;
rating: number;
color_code:string;
status: string;
status_id: number;
status_label: string;
}

export interface IndividualBiaRating{
    id: number;
    level: string;
    rating: number;
    color_code
}

export interface BiaRatingStorePaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:BiaRating[];
}