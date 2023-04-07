export interface ChangeRequestItems {
    id: number;
    type: string;
    status: string;
    status_id: number;
    status_label: string;
    event_change_request_item_language_title: string;
}

export interface ChangeRequestItemsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ChangeRequestItems[];
}
