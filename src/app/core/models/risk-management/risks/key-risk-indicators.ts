export interface KRI{
unit_id: any;
predicted_exposure: any;
actual_exposure: any;
risk_category_id: any;
key_risk_indicator_id: any;
id:number;
title:string;
exposure:number;

}

export interface KRIPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: KRI[];
}