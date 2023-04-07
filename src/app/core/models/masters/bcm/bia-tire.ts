export interface BiaTire {
    color_code: string;
    id: number;
    title: string;
    order: number;
    scale_id: number;
    from: number;
    to: number;
    bia_scale_category: string;
    status_id: number;
    bia_scale:[]
}
export interface BiaTirePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: BiaTire[];
}

export interface BiaTireDetails {
    id: number;
    title: string;
    color_code
    bia_scale: {
        pivot: {
            bia_scale_id: number;
            bia_tire_id: number;
            order: number;
        }
        from: number;
        to: number;
        bia_scale_category: {
            id: number;
            type: string;
            status_id: number;
        }
    }
    order
    status_id: number;
}

