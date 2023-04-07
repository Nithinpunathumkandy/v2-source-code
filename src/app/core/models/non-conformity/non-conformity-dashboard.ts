export interface FindingCount {
    closed_finding_percentage: number;
    open_finding_percentage: number;
    total_closed_finding: number;
    total_finding: number;
    total_open_finding: number;
}

export interface RiskRating{
    count: number;
    id: number;
    type: string;
}

export interface FindingPieChartCategory{
    count: number;
    id: number;
    title: string;
}

export interface FindingPieChartActionPlan{
    count: number;
    finding_corrective_action_statuses: string;
    id: number;
    type: string;
}

export interface FindingLineDepartment{
    code: string;
    count: number;
    department: string;
    id: number;
}

export interface FindingLineYear{
    total_count: number;
    year: number;
}