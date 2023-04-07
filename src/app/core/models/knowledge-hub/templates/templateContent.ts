import { CreatedBy } from '../../general/created_by';

export interface TemplateContent {
    document_template_content_id: number,
    clause_number: number,
    title: string,
    description: string,
    is_plan:boolean,
    is_do:boolean,
    is_check:boolean,
    is_act:boolean,
    is_checklist_applicable:boolean,
    order:number,
}

export interface TemplateContentDetails{
    checklists?: Checklist[],
    clause_number: string;
    created_at: number,
    created_by: CreatedBy,
    description: string,
    document_template?: DocumentTemplate
    document_template_content?: DocumentTemplateContent
    id: number;
    is_act: number;
    is_check: number;
    is_checklist_applicable: number;
    is_do: number;
    is_plan: number;
    notes: Notes[]
    order: number;
    status: Status;
    title: string;
    updated_at: string;
    updated_by: [],
    is_accordion_active:boolean
}

export interface Status{
    id: number;
    title: string;
    label: string;
}

export interface Checklist{
    document_template_id: number;
    content_id: number;
    checklist_ids:[number]
}
export interface Notes{
    document_template_id: number,
    content_id: number;
    notes: [string];
}

export interface DocumentTemplate{
    created_at: string;
    created_by: number;
    description: string;
    reference_code: string;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: number;
}

export interface DocumentTemplateContent{
    TemplateContentDetails;
    children:DocumentTemplateContent[]
}