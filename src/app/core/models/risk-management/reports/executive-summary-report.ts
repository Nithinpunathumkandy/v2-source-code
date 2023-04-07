import { CreatedBy } from "../../general/created_by";
import { Department } from "../../general/department";
import { Division } from "../../general/division";

export interface ExecutiveReportList {
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: null;
    created_by_last_name: string;
    created_by_status: string;
    date: string;
    department: string;
    department_id: number;
    division: string
    division_id: number;
    id: number;
    reference_code: string;
}


export interface IndividualExecutiveDetail {
    id: number
    created_at: string;
    created_by: CreatedBy;
    date: string;
    department: Department;
    division: Division;
    executive_summary_report_details: executiveSummaryReportDetail[];
    reference_code: string;
}


export interface executiveSummaryReportDetail {
    id: number;
    created_at: string;
    created_by: number;
    description: string;
    executive_summary_report_id: number;
    order: number;
    title: string;
}


export interface ExecutiveReportsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ExecutiveReportList[];
}

