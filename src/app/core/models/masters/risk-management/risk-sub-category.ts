export interface RiskSubCategory {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id: number;
    status_label: string;
    risk_category_id: number;
    risk_category_title: string;

}

export interface RiskSubCategoryPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskSubCategory[];
}

export interface IndividualRiskSubCategory {
    id: number;
    description: string;
    title:string;
    risk_category: {
        description: string;
        id: number;
        status_id: number;
        title: string;
    }
}