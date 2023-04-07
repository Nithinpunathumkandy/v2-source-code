export interface CyberIncidentImpactAnalysisCategory {
    id: number;
    title: string;
    description: string;
    status_id: number;
    status: string;
    status_label: string;
}

export interface CyberIncidentImpactAnalysisCategoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    from: number;
    last_page: number;
    data: CyberIncidentImpactAnalysisCategory[];
}

export interface CyberIncidentImpactAnalysisCategorySingle {
    id: number;
    title: string;
    description: string;
    
}