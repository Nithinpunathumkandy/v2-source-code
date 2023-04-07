export interface IssueType {
    id: number;
    title: string;
    status_id :number;
    status_label: string;
}
export interface IssueTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IssueType[];
}