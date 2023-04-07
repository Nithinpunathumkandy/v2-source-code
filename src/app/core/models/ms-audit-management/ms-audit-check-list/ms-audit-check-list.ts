export interface MsAuditCheckListPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsauditCheckLists[];
}

export interface MsauditCheckLists{
 id : number;
 is_selected : number;
 checklist_group_title:string;
 checklists:Checklists[];
}

export interface Checklists{
    title:string;
    id:string;
}

export interface MsauditCheckListsDetails{
    document_version_contents :any;
    id : number;
    processes :any;
    checklist_group : any;
    documents : any;
    title : string;
}

export interface MsDocumentsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsDocumentsVersions[];
}

export interface MsDocumentsVersions {
    id : number;
    document_version_id : number,
    ms_type_title : string,
    ms_type_version_title : string,
    title : string,
    version : string,
    document_version_title : string;
}


export interface MsDocumentDetails {
    checklists : any;
    document_version : any;
    children_content : ChildrenContent;
    description : string;
    title : string
    id : number
}

export interface ChildrenContent {
    checklists : any;
    comments : any;
    description : any;
    id : any;
    title : string
}