import { Language } from "../internal-audit/auditable-item/auditable-item";

export interface Findings {
    id: number;
    reference_code: number;
    finding_category_id:string;
    risk_rating_id: number;
    sub_sections:string;
    supplier_id:string;
    sections:string;
    title: string;
    description: string;
    recommendation: string;
    finding_status_id: number;
    finding_status_title: string;
    finding_quick_actions:{
        id:number;
        title:string;
        finding_id:string;
        description:string;
    }
    evidence: string;
    created_by: string;
    created_by_first_name: string;
    created_by_last_name: string;
    created_by_image_token: string;
    created_by_designation: string;
    created_by_department: string;
    created_by_status: string;
    created_at: string;
    updated_by: string;
    updated_by_first_name: string;
    updated_by_last_name: string;
    updated_by_image_token: string;
    updated_by_designation: string;
    updated_by_department: string;
    updated_by_status: string;
    updated_at: string;
    branch_ids:string;
    divisions: string;
    departments: any;
    department_ids:number;
    organizations:string;
    documents:string;
    organization_ids:number;
    
    division_ids:number;
    section_ids:number;
    sub_section_ids:number;
    finding_category:string|findingCategory;
    supplier:string|Supplier;
    risk_rating:RiskRating;
    risk_ratings:RiskRating;
    finding_status:FindingStatus;
    findingStatus:FindingStatus;
}

export interface Supplier {
    id: number;
    title: string;
}
export interface FindingStatus{
    id:number;   
    status_id: number;
    label:string;
    language: Language[];
}
export interface RiskRating {
    title: string;
    id: number;
    type: string;
    label:string;
    language: Language[];

}

export interface findingCategory{
    id:number;
    title:string;
}
export interface QuickCorrection{
    id: number;
    title:string;
    description:string;
}
export interface FindingsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Findings[];
}