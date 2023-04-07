export interface StrategyMapping{          
    id:number  
    end_date:string;    
    start_date:string;
    title:string;
    score:number
    strategy_profile_focus_areas:StrategyProfileArea[]
}

export interface StrategyProfileArea{
    id:number;
    weightage:number;
    objectives:Objectives[]
}

export interface Objectives{
    start_date:string
    end_date:string
    weightage:number
    kpis:KPIS[]
    initiatives:Initiatives[]
    objective_id: number;
    id:number;
}

export interface Initiatives{
    budget:number
    score:number
    description:string
    title:string
    target:number
    weightage:number
}

export interface KPIS{
    description:string
    maximum:number;
    minimum:number;
    target:number;
}

export interface objectiveType{
    with_child:childObjectiveType[]
    with_out_child:childObjectiveType[];
}
export interface childObjectiveType{
    child_objective_type:[];
    strategy_profile_objectives:any;
    title:string;
    id:number;
}