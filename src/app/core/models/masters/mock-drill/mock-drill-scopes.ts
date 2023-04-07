export interface MockDrillScopes {
    id: number,
    mock_drill_scope_title: string,
    type: string;
    status_id: number,
    status_label: string,
    status: string,
}
export interface MockDrillScopesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillScopes[];
}
export interface MockDrillScopesSingle {
    id: number;
    languages: MockDrillScopesSingleLanguage[];
}
export interface MockDrillScopesSingleLanguage {
    language_id: number;
    title: string;
    pivot: {
        mock_drill_scopes_id: number,
        language_id: number,
        title: string
    }
}
