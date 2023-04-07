export interface TrainingMatrixDetails { 
    recommended_trainings: RecommendedTrainingList 
    scheduled_trainings: ScheduledTrainingList
}

export interface ScheduledTrainingList{
scheduled_trainings: {
        competency_group_id: number;
        created_at: string
        created_by: number;
        description: string
        end_date: string
        id: number;
        reference_code: string
        start_date: string
        title: string
        trainer: string
        trainer_description: string
        training_category_id: number;
        training_competencies: {
            competency_group_id:number;
            created_at: string
            created_by: number;
            description: string
            id: number;
            pivot: {
                competency_id: number;
                training_id: number;
            }
            status_id: number;
            title: string
        }
        training_status_id: number;
        updated_at: string
        updated_by: string
        venue: string
        web_url: string
    }
}
export interface RecommendedTrainingList{
    recommended_trainings: {
            competency_group_id: number;
            created_at: string
            created_by: number;
            description: string
            end_date: string
            id: number;
            reference_code: string
            start_date: string
            title: string
            trainer: string
            trainer_description: string
            training_category_id: number;
            training_competencies: {
                competency_group_id:number;
                created_at: string
                created_by: number;
                description: string
                id: number;
                pivot: {
                    competency_id: number;
                    training_id: number;
                }
                status_id: number;
                title: string
            }
            training_status_id: number;
            updated_at: string
            updated_by: string
            venue: string
            web_url: string
        }
    }