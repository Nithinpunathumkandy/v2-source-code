export interface CompetencyMatrix {
    competencies:Competency[];
    competency_group: Matrix[];
    user_score:any[];
}

export interface Matrix {
    id:number;
    title:string;
    competency_count:number;
}

export interface Competency {
    
    id: number;
    title:string;
    competency_group_id:number;
}

export interface Users{
    first_name:string;
    last_name:string;
    designation:string;
    image_token:string;
    score: number;
    competency_score: number;

}