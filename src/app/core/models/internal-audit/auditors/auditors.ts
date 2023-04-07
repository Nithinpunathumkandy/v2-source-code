export interface Auditors {
    audit_program_auditor_id:number;
    id:number;
    high:number;
    low:number;
    medium:number;
    total:number;
    very_high:number;
    na:number;
    user:{
        id: number;
    designation_id:number;
    first_name: string;
    last_name: string;
    email: string;
    image_token: string;
    designation:{
        title:string;
    }
    department:{
        title: string;
    }
    }
}

export interface AuditorsDetails {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: Auditors[];
}