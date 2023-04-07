import { Documents } from "../../../masters/human-capital/user-kpi";

export interface Discussion {
   
    title: string;
    created_by:{
        first_name:string;
        last_name:string;
    };
    description: string;
    documents:Documents
}

export interface DiscussionPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: Discussion[];
}