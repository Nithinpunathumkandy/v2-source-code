export interface ChecklistAnswersKey {
    id: number;
    title: string;
    status: string;
    status_id :number;
}

export interface ChecklistAnswersKeyPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ChecklistAnswersKey[];
}