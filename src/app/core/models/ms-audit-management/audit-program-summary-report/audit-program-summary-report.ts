export interface MsAuditProgramReoportPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsauditProgramReoport[];
}

export interface MsauditProgramReoport{
 id : number;
 title:string;
}

export interface MsauditProgramReoportDetails{
    id : number;
    is_selected : number;
    title:string;
    created_by : any;
    created_at : any;
    executive_summary : ExecutiveSummary,
    ms_audit_annual_summary_report_content : MsAuditAnnualSummaryReporContent []
   }
   
   export interface  MsAuditAnnualSummaryReporContent {
    title : string;
    details : MsAuditAnnualSummaryReporContentDetails []
   }

   export interface ExecutiveSummary {
    id : number;
    title:string;
    type : string;
    order : number;
   }

   export interface  MsAuditAnnualSummaryReporContentDetails {
    id : number;
    title:string;
    type : string;
    order : number;
    description : string;
    graph : Graph[];
    ms_audit_annual_summary_report_id : number;
    ms_audit_program_id : number;

   }

   export interface Graph {
       
   }