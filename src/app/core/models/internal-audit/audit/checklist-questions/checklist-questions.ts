export interface ChecklistQuestions {
    id: number;
    title: string;
    auditable_item_title: string;
    auditable_item_reference_code: number;
    auditable_item_id: number;
    checklist_id:number;
    risk_rating:string;
    status: string;
    answer: answers;
    status_id :number;
}

export interface answers {
    id:number;
    documents: Documents[];
    audit_checklist_answer_key_id:number;
    audit_schedule_id: number;
    auditable_item_id:number;
    checklist_id:number;
    remarks: string;
    finding_id:number;
    finding:Finding
}

export interface Finding{
    finding_category_id:number;
    risk_rating_id:number;
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_job_id:string;
}

export interface ChecklistQuestionsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ChecklistQuestions[];
}