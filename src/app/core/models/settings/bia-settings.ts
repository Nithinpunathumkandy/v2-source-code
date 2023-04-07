export interface BiaSettings{
    id
    is_impact_area: any;
    is_impact_scenario: any;
    recommended_rto_rating:{
        id: number
        level: string
        rating: number
    };
    recommended_mtpd_rating:{
        id: number
        level: string
        rating: number
    };
}