    export interface BiaCategory{
        bia_impact_rating_id: number
        bia_impact_rating_level: string;
        id: number;
        status: string;
        status_id: number;
        status_label: string;
        title: string;
    }
    
    export interface IndividualBiaCategory{
        id: number;
        bia_impact_rating :
        {
            id: number;
            level: string;
            rating: number;
            status_id: number;
        }
        title: string;
    }
    
    export interface BiaCategoryPaginationResponse{
        current_page:number;
        per_page:number;
        total:number;
        data:BiaCategory[];
    }