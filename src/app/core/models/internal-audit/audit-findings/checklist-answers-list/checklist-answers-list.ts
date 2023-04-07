import { AuditableItem } from '../../auditable-item/auditable-item';

export interface ChecklistAnswersList {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
    audit_checklist_answer_key_id:number;
    audit_checklist_answer_key: Answers;
    auditable_item: AuditableItem;
    checklist: Checklists;
}

export interface Checklists{
    title:string;
    id:number;
}

export interface Answers{
    language: Languages[];
}

export interface Languages{
    pivot :{
        audit_checklist_answer_key_id:number;
        title:string;
    }
}

export interface ChecklistAnswersListPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ChecklistAnswersList[];
}