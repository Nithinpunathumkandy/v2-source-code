export interface StakeholderType {
    id: number;
    title: string;
}
export interface StakeholderTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    data: StakeholderType[];
}