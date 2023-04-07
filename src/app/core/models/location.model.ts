export interface Location{
    id: number;
    title: string;
    status_id: number;
    status: string;
}

export interface LocationResponse{
    current_page: number;
    data: Location[];
    per_page: number;
    total: number;
}