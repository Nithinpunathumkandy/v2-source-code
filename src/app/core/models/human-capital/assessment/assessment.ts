import { Competency } from '../../masters/human-capital/competency';
import { CreatedBy } from '../../bpm/process/processes';
import { Users } from '../../bpm/arci/arci';

export interface Assessment {
    id: number;
    title:string;
    is_latest:boolean;
    employee_id:number;
    performed_by_id:number;
}

export interface UserAssessment {
    
    competency_group_id:number;
    competency_group_title:string;
    reports:Report[];
}

export interface Detail{
    competency_group_id:number;
    competency_group_title:string;
    reports:Report[];
}

export interface LastAssessment{
    last_assessment_image_token:string;
    last_assessment_date:string;
    days:number;
    last_assessment_designation:string;
    last_assessment_first_name:string;
    last_assessment_last_name:string;
}

export interface Report{
    id: number;
    score:number;
    competency_score:number;
    competency_id:number;
    competency_title:string;
    competency_group_id:number;
    competency_group_title:string;
    required:number;
}

export interface AssessmentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: Assessment[];
}

export interface Result{
    question:number;
    answer:number;
}

export interface AssessmentResult{
    competency_group_score_percentage:AssessmentGroup;
    total_score_percentage:number;
    competency_score:Score[];
    created_by:CreatedBy;
    user:Users;
}

export interface AssessmentGroup{
    group_percentage:string;
    competency_group:CompetencyGroup;
    
}

export interface CompetencyGroup{
    id:number;
    title:string;
}

export interface Score{
    id:number;
    title:string;
    competency_group_id:number;
    pivot:Pivot;
}

export interface Pivot{
    competency_id:number;
    score:number;
    user_competency_assessment_id:number;
}


