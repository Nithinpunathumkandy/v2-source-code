export interface ExcellentByPdca {
    id: number;
    title:string;
}

export interface GoodByPdca {
    id: number;
    title:string;
}

export interface AverageByPdca {
    id: number;
    title:string;
}

export interface BelowAverageByPdca {
    id: number;
    title:string;
}


export interface ByPdcaSummary{
    act:performanceSummary[];
    check:performanceSummary[];
    do:performanceSummary[];
    plan:performanceSummary[];
}

export interface performanceSummary{
   avg_score:string;
}