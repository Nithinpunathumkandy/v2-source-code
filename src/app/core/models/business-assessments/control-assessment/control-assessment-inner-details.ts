export interface controlAssessmentDetails{
    id:number;
    title:string;
    score:number;
    reference_code:string;
    business_assessment_status_title:string;
    business_assessment_status_label:string;
    business_assessment_framework_title:string;
    control_assessment_status:any;
    control_assessment_document_version_contents:ControlAssessmentList[]
}

export interface ControlAssessmentDetailsPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    from:number;
    data:controlAssessmentDetails[];
}
export interface ControlAssessmentList{
    id:number,
    control_assessment_document_version_content_controls:[]
}





