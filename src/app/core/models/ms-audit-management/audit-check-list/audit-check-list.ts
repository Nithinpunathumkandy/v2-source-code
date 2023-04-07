export interface AuditCheckListResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditCheckList[];
}

export interface AuditCheckList {
  id : number;
  checklist_group_title : string;
  title : string;
  processes : string;
  clause_title : string;
  ms_type : string;
  checklist_id : number;
}

