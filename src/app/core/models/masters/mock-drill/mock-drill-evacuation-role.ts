export interface MockDrillEvacuationRole {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    languages: Language[]
}

export interface MockDrillEvacuationRolePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillEvacuationRole[];
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}

export interface MockDrillEvacuationRoleSingle {
    id: number;
    languages: MockDrillEvacuationRoleLanguage[];

}
export interface MockDrillEvacuationRoleLanguage {
    id: number;
    pivot: MockDrillEvacuationRoleSingleLanguage[]
}
export interface MockDrillEvacuationRoleSingleLanguage {
    mock_drill_evacuation_role_id: string;
    language_id: number;
    title: string;
}