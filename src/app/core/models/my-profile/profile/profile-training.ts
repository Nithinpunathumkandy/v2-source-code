export interface ProfileTraining{
    up_coming: {
    end_date: string;
    is_accepted: number;
    is_rejected: number;
    start_date: string;
    status: string;
    title: string;
    training_id: number;
    venue: string;
    web_url: string;
    }
} 

export interface ProfileTrainingPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
}