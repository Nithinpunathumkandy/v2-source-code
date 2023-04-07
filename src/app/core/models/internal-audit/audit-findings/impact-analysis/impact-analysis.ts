
import { FindingImpactAnalysisCategory } from 'src/app/core/models/masters/internal-audit/finding-impact-analysis-category';

export interface ImpactAnalysis {
    id: number;
    finding_impact_analysis_category: FindingImpactAnalysisCategory;
    money: number;
    time : number;
    count: number;
    created_by_first_name: string;
    created_by_last_name: string;
    created_by_image_token:string;
    finding_id:number;
    finding_impact_analysis_category_id:number;
    finding_impact_analysis_category_title:string;
    title:string;


}

export interface ImpactAnalysisPaginationResponse {
    money_total: number;
    total_count: number;
    total_time: number;
    last_page: number;
    from: number;
    data: ImpactAnalysis[];
}