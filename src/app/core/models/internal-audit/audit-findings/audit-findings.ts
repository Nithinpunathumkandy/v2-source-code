import {ExternalAudit} from 'src/app/core/models/external-audit/external-audit/external-audit';
import { AuditFindingCategory } from 'src/app/core/models/masters/internal-audit/audit-finding-categories';
import { Department } from '../../department.model';
import { Division } from '../../division.model';
import { Organization } from '../../organization.model';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';

import { AuditSchedules } from '../audit-schedule/audit-schedule';
import { ChecklistAnswersList } from './checklist-answers-list/checklist-answers-list';

export interface AuditFindings {
    id: number;
    title: string;
    finding_status_title:string;
    finding_status_id:number;
    status: string;
    status_id :number;
    departments: Department[];
    divisions: Division[];
    audit_schedule: AuditSchedules;
    auditable_items:AuditableItem[];
    sections: Section[];
    sub_sections : SubSection[];
    organizations: Organization[];
    risk_rating: {
        title: string;
        id: number;
        type: string;
        language: Language[];

    }
    finding_resolved_cycle_time: ResolveCycleTime;
    findingStatus:{
     id:number;   
     status_id: number;
     language: Language[];
    }
    finding_category: AuditFindingCategory;
    description: string;
    recommendation: string;
    evidence:string;
    correction: string;
    correction_description: string;
    schedule_checklist_answers:ChecklistAnswersList[];
    corrections: Corrections[];
    impact_analysis_details: ImpactAnalysisDetails[];
    reference_code: number;
    created_by: CreatedBy;
    created_at: string;
    documents: Documents[];
    audit_id:number
}

export interface ResolveCycleTime{
    hours:string;
    days: string;
}

export interface ImpactAnalysisDetails{
    title:string;
    value:number;
    color:string;
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}


export interface Corrections{
    id:number;
    title:string;
    description: string;
    created_at:string;
    created_by:CreatedBy; 
}

export interface CreatedBy{
    designation: string,
    first_name: string,
    last_name: string,
    image:Image
  }
  

export interface AuditFindingsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditFindings[];
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
}


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}

export interface AuditableItemCategory {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export interface AuditableItemType {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}

export class RiskRating {
    id: number;
    title: string;
    type: string;
    language: Language[];
  
  }

export interface AuditableItem {
    id: number;
    auditable_item_category: AuditableItemCategory;
    auditable_item_type:AuditableItemType;
    risk_rating: RiskRating;
    title: string;
    description:string;
    departments: Department[];
    divisions: Division[];
    reference_code: number;
    created_by: CreatedBy;
    created_at: string;
    status_id: number;
    finding_category:FindingCategory;
    finding_status:FindingStatus;
}


export interface FindingStatus{
    label:string;
    language:Language;
    type: string;
}

export interface Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}


export interface FindingCategory {
    title: string;
}

