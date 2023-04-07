
//1
export interface KpiCounts{
    approve_count: number;
    draft_count: number;
    in_review_count: number;
    reject_count: number;
    total_count: number;
}

//2
export interface KpiImprovementPlanCounts{
    closed_count: number;
    closed_percentage: string;
    open_count: number;
    open_percentage: string;
    over_due_count: number;
    resolved_percentage: number;
    total_count: number;
}
//3
export interface KpiByPerformanceCounts{
    average_count: number;
    excellent_count: number;
    good_count: number;
}

//4
export interface KpiPerformanceByDepartmentCounts{
    averageCount: number;
    excellentCount: number;
    goodCount: number;
    id: number;
    title: string;
}

//5 
export interface KpiByTypePaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KpiByType[];
}
export interface KpiByType{
    achieved_percentage:string;
    title: string;
}


export interface KpiCountByDepartment{
    code: string;
    count: number;
    id: number;
    title: string;
}

//6
export interface KpiPerformanceByTypeCounts{
    average_count: number;
    excellent_count: number;
    good_count: number;
    title: string;
}


// kpi Detials Dashboard 

// 1
export interface KpiCountByStatus{
    count: number;
    id: number;
    title: string;
    color: string;
}
//2
export interface KpiPerformancebyTypeCounts{
    averageCount: number;
    excellentCount: number;
    goodCount: number;
    id: number;
    title: string;
}

export interface KpiCountByCategory{
    count: number;
    id: number;
    title: string;
}

export interface KpiTopPerforming{
    id: number;
    achieved_percentage : string;
    title: string;
}

export interface KpiLeastPerforming{
    id: number;
    achieved_percentage : string;
    title: string;
}