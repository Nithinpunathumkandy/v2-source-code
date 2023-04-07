
export interface Label {
    id: number;
    key: string;
    label: string;
    language_id: number;
    languages: Languages[];
    status: string;
    status_id: number;
}

export interface LabelPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Label[];
}

export interface Languages{
    code: string;
    created_at: string;
    created_by: number;
    id: number;
    is_primary: number;
    is_rtl: number;
    status_id: number;
    title: string;
    type: string;
    pivot: LanguagePivot;
}

export interface LanguagePivot{
    label_id: number;
    language_id: number;
    title: string;
}