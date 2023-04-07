export interface ProfileCompetencies{
    details:CompetencyDetail[];
    last_assessment:CompetencyLastAssessment[];
    length:number;
}

export interface CompetencyDetail{
    competencies: competencyArray[];
    competency_group_id: number;
    competency_group_title: string;
}

export interface CompetencyLastAssessment{
    days: 0
    last_assessment_date: string;
    last_assessment_designation: string;
    last_assessment_first_name: string;
    last_assessment_image_token: string;
    last_assessment_last_name: string;
    last_assessment_user_id: number;
}

export interface competencyArray{
    competency_average_percentage: number;
    competency_id: number;
    competency_score: number;
    competency_title: string;
    competency_group_id: number;
    competency_group_title: string;
    id: number;
    required:number;
    score: number;
}