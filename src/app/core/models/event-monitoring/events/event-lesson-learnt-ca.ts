export interface CaPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: CorrectiveActions[];
}

export interface CorrectiveActions {
    id: number;
    title: string;
    description: string;
    start_date: Date;
    target_date: Date;
    responsible_user: ResponsibleUsers;
    created_at: string;
    created_by: number;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    lesson_learnt_corrective_action_status: string;
    lesson_learnt_corrective_action_status_id: number;
    lesson_learnt_corrective_action_status_label:string;
    lesson_learnt_id: number;
    reference_code: string;
    responsible_user_designation: string;
    responsible_user_first_name: string;
    responsible_user_id: number;
    responsible_user_image_ext: string;
    responsible_user_image_sizee: number;
    responsible_user_image_title: string;
    responsible_user_image_token: string;
    responsible_user_image_url: string;
    responsible_user_last_name: string;
 
}

export interface ResponsibleUsers {
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status: {
        id: number;
    }
    designation: string,
    image_token: string;
    image: Image
}

export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    image_token: string;
    size: number;
    ext: string;
}

export interface IndividualCorrectiveAction {
    id: number;
    title: string;
    description: string;
    start_date: Date;
    percentage;
    documents;
    target_date: Date;
    reference_code: string;
    responsible_user: ResponsibleUsers;
    corrective_action_status: Status;
    created_by: CreatedBy;
    created_at: string;
    lesson_learnt_corrective_action_update:LessonLearntCorrectiveActionUpdate[]; 
    
}

export interface LessonLearntCorrectiveActionUpdate{
    id:number;
    lesson_learnt_corrective_action_id:number
    lesson_learnt_corrective_action_status_id:number
    percentage:number;
    comment:string;
    created_by:CreatedBy
    created_at: string;

}

export interface Status {
    id: number;
    language: Language[];
    type:string;
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}

export interface CreatedBy {
    designation: string;
    first_name: string;
    last_name: string;
    image: Image;
}

export interface caHistoryPaginationData{
    data:caHistoryData[]
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    comment:string;
}

export interface caHistoryData{
    created_at:string;
    created_by:number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    lesson_learnt_corrective_action_status_id: number;
    lesson_learnt_corrective_action_status_title: string;
    id: number;
    comment: string;
    documents;
    percentage: number;
    treatment_title: string;
    updated_at: string;
    updated_by: string;
    updated_by_department: string;
    updated_by_designation: string;
    updated_by_first_name: string;
    updated_by_image_token: string;
    updated_by_last_name: string;
    updated_by_status: string;
}