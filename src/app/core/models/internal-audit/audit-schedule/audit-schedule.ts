import { Department } from '../../department.model';
import { Division } from '../../division.model';
import { UpdatedBy } from '../../general/updated_by';
import { AuditCheckList } from '../../masters/internal-audit/audit-check-list';
import { AuditableItem } from '../../masters/internal-audit/auditable-item';
import { Organization } from '../../organization.model';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { AuditPlan } from '../audit-plan/audit-plan';

export  interface AuditSchedules{

    id: number;
    auditable_items: AuditableItem[];
    auditees: Auditees[];
    auditors: Auditors[];
    checklists: AuditCheckList[];
    checklist_answer_count: ChecklistCount[];
    department: Department;
    audit: Audit;
    division: Division;
    organization: Organization;
    section: Section;
    sub_section : SubSection;
    is_audited: number;
    end_date: Date;
    start_date: Date;
    title: string;
    audit_plan: string;
    description:string;
    reference_code: number;
    created_by: CreatedBy;
    created_at: string;
    updated_by:UpdatedBy;
  }

  export interface ChecklistCount{
    title:string;
    count:number;
  }

  export interface Audit {
    audit_plan: AuditPlan;

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

  export interface AuditSchedulesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: AuditSchedules[];
}


  export interface Auditees{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    is_auditor: number;
    pivot:{
      is_present:number;
    }
    designation: {
      title:string;
    },
    status_id:number;
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