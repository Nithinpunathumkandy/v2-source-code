export interface ImpactArea{
    id: number;
    impact_scenarios_title: string;
    status: string;
    status_id: number;
    status_is_active: number;
    status_is_inactive: number;
    status_label: string;
    title: string;
    }
    
    export interface IndividualImpactArea{

        id: number;
        biaImpactScenario : {
            bia_impact_category_id: number;
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
    
    export interface ImpactAreaPaginationResponse{
        current_page:number;
        per_page:number;
        total:number;
        data:ImpactArea[];
    }