export interface SOA{
    reference_code:string;
    id:number;
    title:string;
    description:string;
    soa_implementation_status:any
    soa_status:any;
    justify:string;
    method:string;
    comment:string;
    control_category:any;
    control_objectives:any;
    control_type:any;
    created_by:any;
    created_at:string;
    control_sub_category:any;
    control_efficiency_measure:any;
    control_mode:any;
    control_control_efficiency_remarks:any;
    }
    
    export interface SOAPaginationResponse{
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
        from: number;
        data: SOA[];
    }