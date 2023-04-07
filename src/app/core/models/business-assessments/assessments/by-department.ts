export interface ExcellentByDepartment {
    id: number;
    title:string;
}

export interface GoodByDepartment {
    id: number;
    title:string;
}

export interface AverageByDepartment {
    id: number;
    title:string;
}

export interface BelowAverageByDepartment {
    id: number;
    title:string;
}


export interface ByDepartmentSummary{
    first:performanceSummary;
    second:performanceSummary;
    third:performanceSummary;
}

export interface performanceSummary{
   avg_score:string;
   department_id:number;
   department_title:string;
}