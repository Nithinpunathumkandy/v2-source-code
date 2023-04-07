export interface ExcellentByMsType {
    id: number;
    title:string;
}

export interface GoodByMsType {
    id: number;
    title:string;
}

export interface AverageByMsType {
    id: number;
    title:string;
}

export interface BelowAverageByMsType {
    id: number;
    title:string;
}


export interface ByMsTypeSummary{
    first:performanceSummary;
    second:performanceSummary;
    third:performanceSummary;
}

export interface performanceSummary{
   avg_score:string;
   ms_type_id:number;
   ms_type_title:string;
   ms_type_version_id:number;
   ms_type_version_title:string;
}