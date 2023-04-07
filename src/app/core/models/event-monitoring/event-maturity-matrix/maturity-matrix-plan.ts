import { CreatedBy } from "../../general/created_by";
import { Image } from "../../image.model";
import { ResponsibleUsers } from "../events/events";

export interface MatrixPlanPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MatrixPlan[];
}

export interface MatrixPlan{
    created_at: string;
    created_by: number;
    created_by_department: string;
    created_by_designation: string;
    created_by_first_name: string;
    created_by_image_token: string;
    created_by_last_name: string;
    created_by_status: string;
    description: string;
    end_date: string;
    id: number;
    owner_firstname: string;
    owner_lastname: string;
    event_owner_designation:string;
    reference_code: string;
    start_date: string;
    title: string;
}

export interface MatrixPlanDetails{
    created_at: string;
    created_by: CreatedBy;
    description: string;
    event_maturity_matrix_plan_status:any;
    end_date: string;
    id: number;
    reference_code: string;
    start_date: string;
    title: string;
    responsible_users: ResponsibleUsers[];
}

export interface MatrixType{
    created_at: string;
    created_by: CreatedBy;
    id: number;
    event_maturity_type:string;
    event_maturity_range:eventMaturityRange[];
    event_maturity_matrix_type_title: string;
    
}

export interface MatrixAsessement{
    created_at: string;
    created_by: CreatedBy;
    id: number;
    event_maturity_type:string;
    event_maturity_range:eventMaturityRange[];
    event_maturity_matrix_type_title: string;
    
}

export interface eventMaturityRange{
    title:string;
    event_maturity_parameters:eventMaturityParameters[]
}
export interface eventMaturityParameters{
    created_at:string;
    created_by:number;
    id:number;
    checklist:null;
    language:[];
}
// export interface ResponsibleUsers{
//     id: number,
//     first_name: string,
//     last_name: string,
//     email: string;
//     mobile: number;
//     status?:{
//         id:number;
//     }
//     designation: string,
//     image_token?: string;
//     image?:Image
//   }