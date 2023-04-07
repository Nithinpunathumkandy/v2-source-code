export interface BiaMatrixList{
    id: number;
    level: string;
    rating: number;
    bia_impact_categories:BiaImpactCategories[]
}

export interface BiaImpactCategories{
    bia_impact_rating_id:number;
    id: number;
    title: string
    bia_impact_scenarios:BiaImpactScenarios[]
}

export interface BiaImpactScenarios{
    bia_impact_category_id: number
    id: number
    title: string
    bia_impact_areas:BiaImpactArea[]
}

export interface BiaImpactArea{
    bia_impact_scenario_id: number;
    id: number;
    title: string;
}