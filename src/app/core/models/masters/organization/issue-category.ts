export interface IssueCategory {
    id: number;
    title: string;
    color_code:string;
    label:string;
    status_id :number;
    status_label: string;
}
export interface IssueCategoryPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: IssueCategory[];
}