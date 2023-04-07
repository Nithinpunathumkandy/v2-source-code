export interface TotalCounts{
    departments:number
    designations:number
    division:number
    sections:number
    roles:number
    users:number
}

export interface CountByDepartment{
    id:number
    code:string
    department:string
    count:number
}

export interface CountByDesignation{
    id:number
    code:string
    designation:string
    count:number
}

export interface CountByRoles{
    id:number
    role:string    
    count:number
}