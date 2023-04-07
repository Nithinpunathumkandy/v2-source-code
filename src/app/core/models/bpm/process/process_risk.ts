
export interface ProcessRiskPaginationResponse{
    current_page:number;
    total:number;
    per_page:number;
    from:number;
    data:ProcessRisks[];
}
export interface ProcessRisks {
    id:number;
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    description: string;
    reference_code: string;
    risk_classification_id: number;
    risk_classification_title: string;
    risk_id: number;
    risk_type_id: number;
    risk_type_title: string;
    status: string;
    status_id: number;
    status_label: string;
    title: string;
    label: string;
    risk_category_title: string;
    risk_types: string;
    risk_status_id: number;
    updated_at: string;
    updated_by: number;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: string;
    updated_by_last_name: string;
    updated_by_status: string;
  }