import { ProcessGroup } from '../arci/arci';
import { ProcessCategory } from '../../masters/bpm/process-category';
import { Organization } from '../../organization.model';
import { Controls } from '../controls/controls';
import { Language } from '../../knowledge-hub/documents/documentDetails';
import { Branch } from '../../branch.model';

export interface Processes {
  is_selected: any;
  id:number;
  process_group_id: number;
  process_category_id: number;
  organization_id: number;
  division_id: number;
  department_id: number;
  section_id: number;
  branch_id: number;
  sub_section_id: number;
  title: string;
  description: string;
  scope: string;
  cycle_time: string;
  control_ids: [number];
  ms_type_organization_ids: [number];
  accountable_user_ids: [number];
  documents: Document[];
  process_flow_documents: ProcessFlow[];
  controls:Controls[];
  status: string;
  status_id: number;
  status_label: string;
}

export interface ProcessDetails {
  id: number,
  department: Department,
  description: string,
  division: Division,
  branch: Branch,
  process_accountable_users: ProcessAccountableUsers[],
  process_consulted_users: ProcessConsultedUsers[],
  process_responsible_users: ProcessResponsibleUsers[],
  process_ms_type_organizations: IssueMsType[],
  process_informed_users: ProcessInformedUsers[],
  process_documents: Documents[],
  process_flow_documents: Documents[],
  process_controls: processControls[],
  process_group: ProcessGroup,
  process_category: ProcessCategory,
  organization: Organization,
  cycle_time:string,
  reference_code: string,
  scope: string,
  risk_rating: string,
  section: Section,
  sub_section:SubSection,
  created_at: string,
  title:string,
  created_by: CreatedBy
  process_owner: {
    department: string,
    designation: string,
    email: string,
    first_name: string
    id: number,
    image: Image,
    last_name: string,
    mobile:number,
  }
  process_risks: [{
    id: number,
    process_id: number,
    title: string,    
  }]

}

export interface processControls{
  reference_code: string,
  id:number,
  title: string,
  control_objecetives: objectivesData[],
  control_efficiency_measure:ControlEfficiencyMeasure
  is_accordion_active?: boolean;
  control_category: controlCategory,
  control_type:controlType
}
export interface ControlEfficiencyMeasure{
  label: string;
  language:Language[]
}

export interface controlType {

  id: number,
  title:string,


}

export interface controlCategory{
  id: number,
  title:string,
}

export interface objectivesData {
  title:string,
}

export interface Documents{
  created_at: string,
  created_by: string,
  ext: string,
  id: number,
  is_process_flow: number,
  process_id: number,
  size: number,
  thumbnail_url: string,
  title: string,
  token: string,
  updated_at: string,
  updated_by: string,
  url:string
}


export interface ProcessInformedUsers{
  id: number,
  first_name: string,
  last_name: string,
  email: string;
  mobile: number;
  designation: string,
  image:Image
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

export interface Section{
  id: number,
  title:string
}

export interface SubSection{
  id: number,
  title:string
}
export interface ProcessAccountableUsers{
  id: number,
  first_name: string,
  last_name: string,
  email: string;
  mobile: number;
  designation: string,
  image:Image
}
export interface ProcessConsultedUsers{
  id: number,
  first_name: string,
  last_name: string,
  email: string;
  mobile: number;
  designation: string,
  image:Image
}
export interface ProcessResponsibleUsers{
  id: number,
  first_name: string,
  last_name: string,
  email: string;
  mobile: number;
  designation: string,
  image:Image
}
export interface Division{
  id: number,
  title:string
}
export interface Department{
  id: number;
  title: string;
}
export interface CreatedBy{
  id:number;
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

export interface Document {
  name: string;
  ext: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url: string;
  token: string;
  title:string;
}

export interface ProcessFlow {
  name: string;
  ext: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url: string;
  token: string;
}

export interface ProcessesPaginationResponse{
    current_page:number;
    total:number;
    per_page:number;
    from:number;
    data:Processes[];
}

export interface ProcessStatusesPaginationResponse{
  current_page:number;
  total:number;
  per_page:number;
  from:number;
  data:ProcessStatuses[];
}

export interface ProcessStatuses{
  id: number;
  label: string,
  title: string,
}
