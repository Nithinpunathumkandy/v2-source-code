export interface FindingImpactAnalysisCategory {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
    money: number;
    time : number;
}
export interface FindingImpactAnalysisCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: FindingImpactAnalysisCategory[];
}