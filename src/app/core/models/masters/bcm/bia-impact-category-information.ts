import { number } from "@amcharts/amcharts4/core";

export interface BiaImpactCategoryInformation {
    id: number;
    title: string;
    description: string;
    amount: string;
    bia_impact_category: {
        id: number;
        title: string;
    }

    bia_impact_rating: {
        id: number;
        rating: number;
    }
    created_by

}
export interface BiaImpactCategoryInformationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BiaImpactCategoryInformation[];
}