export interface ActionPlnsResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ActionPlan[];
}

export interface ActionPlan {
    id : number
    actual_value : number,
    cost : number,
    justification : string,
    responsible_users : any,
    focus_area_title : string,
    objective_title : string,
    start_date : string;
    strategy_initiative_milestone_title : string,
    title : string,
    target : number,
    target_unit_title : string,
    actual_end_date : string,
   
}

export interface OtherActionPlnsResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: OtherActionPlan[];
}
export interface OtherActionPlan {
   
}