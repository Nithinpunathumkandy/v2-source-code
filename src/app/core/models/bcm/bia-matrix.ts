export interface BiaMatrix{
    bia_rating:any
    impact_level:any
    impact_category:ImpactCategory[]
}

export interface ImpactCategory{
    title:any
    cat_impact_level:any
    impact_scenario:ImpactScenario[]
}

export interface ImpactScenario{
    title:any
    scenario_category:any
    scenario_category_level:any
    impact_area:ImpactArea[]
}

export interface ImpactArea{
    title:any
    area_scenario:any
    area_category:any
    area_cat_level:any
}