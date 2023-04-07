import { CreatedBy } from '../../human-capital/users/user-document';
import { Status } from '../../status.model';

export interface MaturityModal{
    id:number;
    title:string;
    
}

export interface IndividualMaturityModal{
    id:number;
    reference_code:string;
    description:string
    score:number;
    title:string;
    created_by:CreatedBy;
    created_at:string;
    status:Status;
    maturity_model_levels:any[];
}

export interface MaturityModalPaginationResponse{
    current_page:number;
    per_page:number;
    total:number;
    data:MaturityModal[];
}




