export interface EventsSpecification {
    id: number;
    title: string;
    comments:string;
    event_equipment_title:string;
    equipment_required:string;
    availability_status:number;
}

export interface SpecificationDetails{
    id:number
    availability_status:number
    event_equipment:any
    comments:string
}