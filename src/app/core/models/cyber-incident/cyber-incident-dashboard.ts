export interface IncidentCount {
    investigated_count : number;
    investigating_count : number;
    new_count : number;
    total_cyber_incident : number ;
    total_corrective_action: number;

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

export interface IncidentCorrectiveActionCountByDepartments {
    count: number;
    department : string;
    department_code :string;
}