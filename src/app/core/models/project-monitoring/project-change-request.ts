export interface ProjectChangeRequestResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ProjectChangeRequest[];
}

export interface ProjectChangeRequest {
    type : string,
    id :number,
    label : number,
    project_change_request_reference_code : string,
    project_monitor_change_request_status_language_title : string;
    departments : string;
    version_no : number;
    

}

export interface ProjectChangeRequestItems {
    type:string;
    status_label : string;
    project_change_request_item_language_title : string;
    id : number;
    status : string;
    
}


