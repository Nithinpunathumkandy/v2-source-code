import { RootCauseCategory,RootCauseCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-categories';
import { RootCauseSubCategory,RootCauseSubCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-sub-categories';

export interface RootCauseAnalysis {
    id: number;
    title: string;
    status: string;
    status_id :number;
    finding_id: number;
    root_cause_category_id: RootCauseCategory;
    description : string;
    root_cause_sub_category_id: RootCauseSubCategory;
    root_cause_category: string;
    root_cause_sub_category:string;
    why: string;

    created_by_image_token: string;
    created_by_first_name:string;
    created_by_last_name:string;
    created_by_designation:string;

}

export interface RootCauseAnalysisPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: RootCauseAnalysis[];
}