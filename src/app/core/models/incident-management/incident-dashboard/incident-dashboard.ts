export interface IncidentCount {
    investigated_count : number;
    investigating_count : number;
    new_count : number;
    total_incident : number ;

}

export interface IncidentCountByYears {
    total_count : number;
    year :any 
}

export interface IncidentCountByMonths {
    total_count: number;
    month : string,
}

export interface IncidentCountByDepartments {
    count: number;
    department: string;
    department_code:string;
}

export interface IncidentCountByCategories {
    count : number;
    incident_category : string;
}

export interface IncidentCorrectiveActionCountByDepartments {
    count: number;
    department : string;
    department_code :string;
}

export interface IncidentEmployeesVsPersonInvolved {
    count:number;
    label: string;
}