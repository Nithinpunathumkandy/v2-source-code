export interface BiaScale{
    bia_scale_category: string;
    bia_scale_category_id: number;
    created_by_status: string;
    from: any;
    id: any;
    status: string;
    status_id: any;
    status_label: string;
    to: any;
    is_range_value,
    order
    }
    
    export interface IndividualBiaScale{

        from: number;
        id: number;
        to: number;
        bia_scale_category : {
            created_at: string;
            created_by: number;
            id
            status_id: number;
            type: string;
        }
        is_range_value,
        order
    }
    
    export interface BiaScalePaginationResponse{
        current_page:number;
        per_page:number;
        total:number;
        data:BiaScale[];
    }