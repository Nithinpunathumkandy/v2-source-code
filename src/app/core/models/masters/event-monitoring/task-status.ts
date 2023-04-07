export interface Taskstatus {
    id: number;
    type: string
    title: string;
    taskstatus: string;
    taskstatus_id: number;
    taskstatus_label: string;
}

export interface TaskstatusPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Taskstatus[];
}
export interface TaskstatusSingle {
    id: number;
    languages: TaskstatusLanguage[];
    
}
export interface TaskstatusLanguage{
    id:number;
    taskstatus:TaskstatusSingleLanguage[]
}
export interface TaskstatusSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}