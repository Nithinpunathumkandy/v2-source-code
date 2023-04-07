import { CreatedBy } from "../../human-capital/users/user-kpi";
import { SubSection } from "../../human-capital/users/user-setting";
import { Department, Division, Organization, Section,Subsection } from "../../human-capital/users/users";
import { Documents } from "../../knowledge-hub/documents/documents";

export interface AmInformationRequest {
    created_at: any;
    id: number;
    reference_code: string;
    start_date: string;
    end_date: string;
    created_by: CreatedBy;
    description:string;
    objective:string;
    criteria:string;
    scope:string;
    out_of_scope:string;
    am_individual_audit_plan:any;
    organization:Organization;
    division:Division;
    department:Department;
    section:Section;
    sub_section:Subsection;
    documents:Documents[];
    am_audit_information_request_status : any;
}



export interface AmInformationRequestPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AmInformationRequest[];
}