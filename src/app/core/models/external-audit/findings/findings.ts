import {ExternalAudit} from 'src/app/core/models/external-audit/external-audit/external-audit';
import { RiskRating } from 'src/app/core/models/masters/external-audit/risk-rating';
import { AuditFindingCategory,AuditFindingCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-finding-categories';
import { Department } from '../../department.model';
export interface Findings {
    id: number;
    title: string;
    status: string;
    status_id :number;
    external_audit: ExternalAudit;
    risk_rating: RiskRating;
    finding_status_label:string;
    finding_category: AuditFindingCategory;
    impact_analysis_details: ImpactAnalysisDetails[];
    finding_status_id:number;
    finding_status_title:string;
    reference_code: number;
    departments: Department[];
    findingStatus:{
        id:number;   
        status_id: number;
        language: Language[];
       },
       finding_resolved_cycle_time: {
        hours:string;
        days: string;
       };
    description: string;
    recommendation: string;
    evidence:string;
    correction: string;
    created_by:CreatedBy;
    created_at:string;
    correction_description: string;
    corrections: Corrections[]; 
    documents: Documents[];

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

export interface FindingsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Findings[];
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

