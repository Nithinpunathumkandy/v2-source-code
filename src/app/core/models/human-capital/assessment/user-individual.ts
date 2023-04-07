export interface ExcellentUser {
    id: number;
    title:string;
    image_token:string;
}

export interface GoodUser {
    id: number;
    title:string;
    image_token:string;
}

export interface AverageUser {
    id: number;
    title:string;
    image_token:string;
}

export interface BelowAverageUser {
    id: number;
    title:string;
    image_token:string;
}



export interface ExcellentUserPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    to:number;
    data: ExcellentUser[];
}

export interface GoodUserPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    to:number
    data: GoodUser[];
}

export interface AverageUserPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    to:number;
    data: AverageUser[];
}

export interface BelowAverageUserPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    to:number;
    data: BelowAverageUser[];
}

export interface SummaryData{
    total_count:number;
    excellent_count:number;
    good_count:number;
    average_count:number;
    below_average_count:number;
    first_data:performanceSummary[];
    second_data:performanceSummary[];
    third_data:performanceSummary[];
}

export interface performanceSummary{
    id:number;
    designation_id:number;
    first_name:string;
    last_name:string;
    assessment_score:number;
    assessment_date:string;
    designation:string;
    image_token:string;
}