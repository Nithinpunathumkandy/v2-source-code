export interface Strategic {
    id: number;
    title: string;
    description:string;
    status_id:number;
    status:any;
    status_label:any;
    organizations:any;
    divisions:any;
    branches: any;
    departments:any;
    sections:any;
    sub_sections:any;

}
export interface StrategicObjectivesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: Strategic[];
}