export interface Notification {
    id: number;
    message: any;
}
export interface NotificationPaginationResponse {
    data: Notification[];
}
export interface NotificationDetails {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface NotificationPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Notification[];
}