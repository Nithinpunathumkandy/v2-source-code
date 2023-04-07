export interface Training{
created_at: string;
created_by: number;
created_by_department: string;
created_by_designation: string;
created_by_first_name: string;
created_by_image_token: null
created_by_last_name: string;
// created_by_status: string;
end_date: string;
id: number;
start_date: string;
title: string;
trainer: string;
training_category_id: number;
training_category_title: string;
training_status_color_code: string;
training_status_id: number;
training_status_label: string;
training_status_title: string;
updated_at: string;
updated_by: number;
updated_by_department: string;
updated_by_designation: string;
updated_by_first_name: string;
// updated_by_image_token: null
updated_by_last_name: string;
updated_by_status: string;
venue: string;
web_url: string;
}

export interface TrainingPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Training[];
}

export interface TrainingCount{
total_cancelled_training: number;
total_completed_training: number;
total_ongoing_training: number;
total_training: number;
total_upcoming_training: number;
cancelled_training_percentage: number;
completed_training_percentage: number;
ongoing_training_percentage: number;
upcoming_training_percentage: number;
}

export interface TrainingAttendies{
    total_attendees: number;
}

export interface TrainingPieStatus{
    color: string;
    count: number;
    id: number;
    training_statuses: string;
}

export interface TrainingBarCompetency{
    count: number;
    id: number;
    title: string;
}

export interface TrainingBarCompetencyGroup{
    count: number;
    id: number;
    title: string;
}

export interface TrainingBarDepartment{
    count: number;
    department: string;
    code: string;
    id: number; 
}

export interface TrainingBarYears{
    total_count: number;
    year: number;
}
