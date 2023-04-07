export interface OrganizationReportList{
    id: string, 
    title: string, 
    type: string, 
    checkLevel?: string,
    reportType: string, 
    reportUniqueKey: string,
    endurl: string, 
    itemId: string, 
    typeValue: string,
    tabletiltle:string, 
    activityname: string,
    listPermission:string 
    paramsId: string;
    downloadFileTitle: string;
    downloadCountFileTitle: string;
}

export interface OrganizationReportCount{
    id: number;
    title: string;
    count: number;
}

export interface OrganizationReportDetails{
    id: number;
    title: string;
}

export interface OrganizationReportsPaginationResponse{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: OrganizationReportDetails[];
}