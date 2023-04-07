export interface ExcellentTeam {
    id: number;
    title:string;
}

export interface GoodTeam {
    id: number;
    title:string;
}

export interface AverageTeam {
    id: number;
    title:string;
}

export interface BelowAverageTeam {
    id: number;
    title:string;
}


export interface TeamSummary{
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
}