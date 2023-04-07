import { AuditFindingCategory } from 'src/app/core/models/masters/internal-audit/audit-finding-categories';
import { FindingImpactAnalysisCategory } from '../../masters/internal-audit/finding-impact-analysis-category';
import { User } from '../../user.model';

export interface ImpactAnalysis {
    id: number;
    finding_impact_analysis_category: FindingImpactAnalysisCategory;
    money: number;
    time : number;
    count:number;
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
    created_at:string;
    created_by:User
    data: ImpactAnalysis[];
}