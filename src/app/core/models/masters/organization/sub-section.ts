export interface SubSection {
    id: number;
    title: string;
    organization_id: number;
    organization_title: string;
    section_id: number;
    section_title: string;
    status_id :number;
    status_label: string;
    department_id: number;
    department_title: string;
    division_id: number;
    division_title: string;
}
export interface SubSectionPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SubSection[];
}