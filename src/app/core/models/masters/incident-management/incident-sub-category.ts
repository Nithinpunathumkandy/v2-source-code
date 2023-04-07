import { IncidentCategories } from '../../masters/incident-management/incident-categories';

export interface IncidentSubCategory {
    id: number;
    title: string;
    description: string;
    incident_category_id: number;
    incidentCategories: IncidentCategories;
    status: string;
    status_id :number;
    status_label: string;
}
export interface IncidentSubCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IncidentSubCategory[];
}

export interface IncidentSubCategorySaveResponse {
    id: number;
    message: string;
}