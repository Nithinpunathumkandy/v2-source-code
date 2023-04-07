import { AuditableItemCategory } from 'src/app/core/models/masters/internal-audit/auditable-item-category';
import { AuditableItemType } from 'src/app/core/models/masters/internal-audit/auditable-item-type';
import { ControlCategory } from 'src/app/core/models/masters/bpm/conrol-category';
import { AuditCheckList } from 'src/app/core/models/masters/internal-audit/audit-check-list';
import { Department } from 'src/app/core/models/masters/organization/department';
import { Division } from 'src/app/core/models/masters/organization/division';
import { MsType } from '../../human-capital/users/user-setting';
import { Organization } from '../../organization.model';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { ControlTypes } from '../../masters/bpm/contol-types';
import { Processes } from '../../bpm/process/processes';



export interface AuditableItem {
    id: number;
    auditable_item_category: AuditableItemCategory;
    auditable_item_type:AuditableItemType;
    risk_rating: RiskRating;
    title: string;
    description:string;
    controls: Controls[];
    checklists: AuditCheckList[];
    departments: Department[];
    divisions: Division[];
    ms_type_organizations: IssueMsType[];
    reference_code: number;
    organizations: Organization[];
    sections: Section[];
    sub_sections : SubSection[];
    documents: Documents[];
    is_deleted: boolean;
    image_token: string;
    created_by: CreatedBy;
    created_at: string;
    status_id: number;
    status: Status;
}

export interface Status{

  id:number;
  title: Title[];
}

export interface Title{
  status_id: number;
  pivot:{
    title:string;
  }
}
export interface CreatedBy{
  designation: string,
  first_name: string,
  last_name: string,
  image:Image
}

export class ImportProcess {

  process_ids: Processes[];
}

export class ImportRisk{
  risk_ids: Risk[]
}
 export class Risk{
   id : number;
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

export interface AuditableItemPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: AuditableItem[];
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
