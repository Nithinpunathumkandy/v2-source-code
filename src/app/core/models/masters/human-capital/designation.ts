import { Competency } from './competency';
import { DesignationLevel } from './designation-level';

export interface Designation {
    id: number;
    designation: string;
    title:string;
    code: string;
    description:string;
    order:number;
    parent_designation: any;
    previous_designation: Designation
    status: string;
    status_id: number;
    status_label: string;
    designation_level: DesignationLevel;
}
export interface DesignationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Designation[];
}

export interface DesignationCompetency {
    id: number;
    competency_group_id:number;
    required:string;
    total_competency_count:number;
    competencies:Competency[];
    competency_group:string;
}