export interface EventChecklistPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventChecklist[];

    //event_checklist_details:Checklist[]
}

export interface Checklist{
    id:number
    comments:string
    documents:Documents[]
    event_checklists:any
    event_checklist_id:number
    event_checklist_status:string
}

export interface EventChecklist {
    event_reference_code: string
    event_checklist_title: string
    event_title: string
    planned_event_completion: string;
    event_checklist_status: string;
    id: number;
    comments:string
    documents:Documents[]
    event_checklists:any
    event_checklist_id:number    
}

export interface IndividualEventChecklist {
    id: number;
    comments: string
    event: any
    checklist: any
    documents: Documents
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at: string;
    created_by: number;
    thumbnail_url: string;
    updated_at: string;
    updated_by: string;
    user_job_id: string;
}
