


export interface NeedsExpectaionPaginationResponse{
    current_page:number;
    total:number;
    per_page:number;
    data:NeedsExpectaion[];
 
}

export interface NeedsExpectaion {
    id:number,
    stakeholder_id: number,
    need_and_expectation_ids: [number],
    is_accordion_active?: boolean;

}

export interface NeedExpectationDetails{
    id: number,
    need_and_expectation_id: number,
    need_and_expectation_title: string,
    stakeholder_id: number,
    stakeholder_title: string,
    stakeholder_type_id: number,
    stakeholder_type_title:string
    
}

export interface NeedExpectationResponse {
    
    id: number,
    title: number,
    type: [{
        0: number,
        1:string
    }],
    is_accordion_active?:boolean
}

