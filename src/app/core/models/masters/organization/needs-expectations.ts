export interface NeedsExpectaions{
    id: number;
    title: string;
    description: string;
    status_id: number;
    status: string;
    created_by: number;
    created_by_first_name: string;
    created_by_last_name: string;
    created_at: string;
    updated_by: number;
    updated_by_first_name: string;
    updated_by_last_name: string;
    updated_at: string;
}

export interface NeedsExpectationsResponse{
    data: NeedsExpectaions[];
    total: number;
    per_page: number;
    from: number;
    current_page: number;
}