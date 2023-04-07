import { AuditableItemCategory } from 'src/app/core/models/masters/internal-audit/auditable-item-category';
import { Department } from 'src/app/core/models/masters/organization/department';
import { Division } from 'src/app/core/models/masters/organization/division';
import { Organization } from '../../organization.model';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { ControlTypes } from '../../masters/bpm/contol-types';
import { AuditObjective } from '../../masters/internal-audit/audit-objective';
import { AuditCriterion } from '../../masters/internal-audit/audit-criterion';
import { AuditProgram } from '../audit-program/audit-program';
import { AuditableItem } from '../auditable-item/auditable-item';
import { AuditCheckList } from '../../masters/internal-audit/audit-check-list';



export interface AuditPlan {
    id: number;
    auditCategory: AuditableItemCategory[];
    audit_program_id: number;
    risk_rating: RiskRating;
    title: string;
    description:string;
    audit_objective: AuditObjective[];
    start_date:Date;
    end_date: Date;
    audit_criterion: AuditCriterion[];
    audit_plan_schedules:number;
    // audit_plan_schedules: Schedules[];
    audit_leader:AuditLeaders;
    audit_program: AuditProgram;
    auditee_leader: AuditeeLeaders;
    departments: Department[];
    divisions: Division[];
    ms_type_organizations: IssueMsType[];
    audit_plan_reference: number;
    audit_program_reference: number;
    organizations: Organization[];
    sections: Section[];
    sub_sections : SubSection[];
    documents: Documents[];
    is_deleted: boolean;
    image_token: string;
    created_by: CreatedBy;
    created_at: string;
    audit_plan_status:AuditPlanStatus;
    audit_plan_status_id:number;
    audit:any
}

export interface AuditPlanStatus{
  id:number,
  type:string,
  language:language[]
}

export interface language{
  id:number,
  pivot:{
    audit_plan_status_id:number,
    title:string
  }
}

export interface CreatedBy{
  designation: string,
  first_name: string,
  last_name: string,
  image:Image
}

export  interface Schedules{

  id: number;
  auditable_items: AuditableItem[];
  auditees: Auditees[];
  auditors: Auditors[];
  checklists: AuditCheckList[];
  department: Department;
  divisions: Division;
  organizations: Organization;
  sections: Section;
  sub_sections : SubSection;
  end_date: Date;
  start_date: Date;
  documents: Documents[];
  title: string;
  description:string;
  reference_code: number;
  created_at:string;
  audit_plan:any;
}


export interface Auditees{
  id: number,
  first_name: string,
  last_name: string,
  email: string;
  mobile: number;
  status_id: number;
  designation: {
    title:string;
  },
  image_token:string;
  image:Image
}


export interface Auditors{
  id: number,
  first_name: string,
  last_name: string,
  email: string;
  mobile: number;
  designation: {
    title:string;
  },
  status_id: number;
  image_token:string;
  image:Image
}




export interface AuditLeaders{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    designation: string,
    status:{
      id:number;
    }
    image:Image
  }


  export interface AuditeeLeaders{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    designation: string,
    status:{
      id:number;
    }
    image:Image
  }



export class RiskRating {
  id: number;
  title: string;
  type: string;
  language: Language[];

}

export class Language{

  title: string;
  type: string;
  pivot: {
    id: number;
    title: string;
  }
}


export interface IssueMsType{
  id: number,
  ms_type_id: number,
  organization_id: number,
  ms_type_version_id: number,
  is_default: number,
  created_at: string,
  updated_at: string,
  created_by: number,
  updated_by: number,
  status_id: number,
  pivot: Pivot
  ms_type: {
      id: number,
      code: string,
      title: string,
      description: string,
      created_at: string,
      updated_at: string,
      created_by: number,
      updated_by: number,
      status_id: number,
  },
  ms_type_version:{
      id: number;
      ms_type_id: number;
      title: string;
  }
}


export interface Pivot{
  organization_issue_id: number,
  issue_category_id: number,
}


export interface Controls{
    reference_code: string,
    id:number,
    title: string,
    control_objecetives: objectivesData[],
    control_category:controlCategory;
    control_type: ControlTypes;
  }

  export interface objectivesData {
    title:string,
  }
  
  export interface controlCategory{
    id: number,
    title:string,
  }

export interface AuditPlanPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: AuditPlan[];
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


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}
