import { CreatedBy } from '../human-capital/users/user-document';
import { Status } from '../status.model';

export interface Frameworks{
    id:number;
    score:number;

}

export interface IndividualFramework{
    id:number;
    reference_code:string;
    description:string
    score:number;
    title:string;
    created_by:CreatedBy;
    is_control_assessment:boolean;
    business_assessment_framework_options:Options[];
    created_at:string;
    status:Status;
    maturity_models:any[]
}

export interface FrameworkPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:Frameworks[];
}

export interface Options{
    title:string;
    score:number;
    
}


