// import { CreatedBy } from '../human-capital/users/user-document';
// import { Status } from '../status.model';

import { CreatedBy } from "../../bpm/process/activity";




export interface controlAssessment{
    id:number;
    title:string;
    start_date: string;
    target_date: string;
    business_assessment_title:string;
    business_assessment_status_title:string;
    business_assessment_action_plan_status_label:string;
    business_assessment_action_plan_status_language_title:string;

}


export interface ControlAssessmentDetails{

    id:number;
    title:string;
    start_date: string;
    target_date: string;
    created_at:string;
    created_by:CreatedBy;
    description:string;
    reference_code:string;
    completion:any;
}

export interface BADocumentContentChecklst{
    id:number;
    checklist_id:number;
}

export interface ControlAssessmentPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    from:number;
    data:controlAssessment[];
}





