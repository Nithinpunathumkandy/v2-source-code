export interface ActionPlan {
    id: number;
    title: string;
    description:string;
    reference_code:number;
    finding_id: number;
    start_date: Date;
    target_date: Date;
    responsible_user:ResponsibleUsers;
    documents: Documents[];
    created_by: CreatedBy;
    created_at: string;
    finding_corrective_action_status_id:number;

}
export interface CreatedBy{
    designation: string;
    first_name: string;
    last_name: string;
    image:Image;
  }

export interface ActionPlanPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ActionPlan[];
}


export interface ResponsibleUsers{
    id: number,
    first_name: string,
    last_name: string,
    email: string;
    mobile: number;
    status:{
        id:number;
    }
    designation: string,
    image_token: string;
    image:Image
  }

  export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    image_token:string;
    size: number;
    ext: string;
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
}