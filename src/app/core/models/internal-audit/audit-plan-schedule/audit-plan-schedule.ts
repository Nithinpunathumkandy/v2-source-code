import { Department } from '../../department.model';
import { Division } from '../../division.model';
import { AuditCheckList } from '../../masters/internal-audit/audit-check-list';
import { Organization } from '../../organization.model';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { AuditPlan } from '../audit-plan/audit-plan';

export  interface Schedules{

    id: number;
    auditable_items: AuditableItems[];
    auditees: Auditees[];
    auditors: Auditors[];
    checklists: AuditCheckList[];
    department: Department;
    audit_plan: AuditPlan;
    division: Division;
    organization: Organization;
    section: Section;
    sub_section : SubSection;
    end_date: Date;
    start_date: Date;
    audit_id: any;
    title: string;
    description:string;
    reference_code: number;
    is_audited: boolean;
    created_by: CreatedBy;
    created_at: string;
    documents: Documents[];
  
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

  export interface CreatedBy{
    designation: string,
    first_name: string,
    last_name: string,
    image:Image
  }
  export interface Image{
    title: string;
    thumbnail_url: string;
    ext: string,
    size: string,
    token: string,
    url: string,
  }

  export interface SchedulesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: Schedules[];
}

export interface MsTypeClauses{
  checklists: Checklist[];
  children: [];
  clause_number:string;
  id: number;
  reference_code: string;
  title: string;
}

export interface Checklist{
  document_template_id: number;
  content_id: number;
  checklist_ids:[number]
}


  export interface Auditees{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status_id:number;
    is_auditor: number;
    pivot:{
      is_present:number;
    }
    designation: {
      title:string;
    },
    image_token:string;
  }
  
  
  export interface Auditors{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status_id:number;
    is_auditor: number;
    pivot:{
      is_present:number;
    }
    designation: {
      title:string;
    },
    image_token:string;
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

export class Language {

  title: string;
  type: string;
  pivot: {
      id: number;
      title: string;
  }
}

  export interface AuditableItems {
    audit_leader_id: number;
    audit_plan_id: number;
    id: number;
    auditable_item_category: AuditableItemCategory;
    auditableItemType:AuditableItemType;
    risk_rating: any;
    risk_rating_label:string;
    risk_rating_type:string;
    title: string;
    description:string;
    departments: Department[];
    divisions: Division[];
    reference_code: number;
    created_by: CreatedBy;
    created_at: string;
    status_id: number;
    // status: Status;
}