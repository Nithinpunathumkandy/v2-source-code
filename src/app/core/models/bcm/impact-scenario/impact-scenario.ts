

export interface ImpactScenario{
id: number;
impact_categories_title: string;
status_is_active: number;
status_is_inactive: number;
status: number;
status_label: string;
title: string;
created_by_status: string;
}

export interface IndividualImpactScenario{
    id: number;
    biaImpactCategory :
    {
        bia_impact_rating_id: number;
        created_at: string;
        created_by: number;
        id: number;
        status_id: number;
        title: string;
        updated_at: string;
        updated_by: number;
    }
    title: string;
}

export interface ImpactScenarioPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:ImpactScenario[];
}
