

export interface MockDrillResponseService {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    languages: Language[]
}
export class Language {
    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}
export interface MockDrillResponseServicePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillResponseService[];
}
export interface MockDrillSingle {
    id: number;
    languages: MockDrillLanguage[];

}
export interface MockDrillLanguage {
    id: number;
    pivot: MockDrillSingleLanguage[]
}
export interface MockDrillSingleLanguage {
    mock_drill_type_id: string;
    language_id: number;
    title: string;
}