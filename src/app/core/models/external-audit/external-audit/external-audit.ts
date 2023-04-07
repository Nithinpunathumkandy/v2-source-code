
import { ExternalAuditTypes } from '../../masters/external-audit/external-audit-types';

export interface ExternalAudit {
    id: number;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    reference_code: number;
    external_audit_type: ExternalAuditTypes;
    description : string;
    responsible_users:ResponsibleUsers[];
    ms_type_organizations:IssueMsType[];
    auditor_name: string;
    start_date: Date;
    end_date: Date;
    documents: Documents[];
    created_by:CreatedBy;
    created_at:string;
    finding_chart_data: ChartDataItems; 

}

export interface ChartDataItems{
  findings_category_details:findings_category_details[];
  findings_count: number;
}

export interface findings_category_details{

  title:string;
  value:number;
}
export interface CreatedBy{
    designation: string,
    first_name: string,
    last_name: string,
    image:Image
  }

export interface ExternalAuditPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ExternalAudit[];
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

export interface ResponsibleUsers{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    designation: string,
    image:Image
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
