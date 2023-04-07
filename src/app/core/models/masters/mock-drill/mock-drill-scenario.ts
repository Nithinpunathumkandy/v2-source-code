

export interface MockDrillScenario {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
    languages: Language[]
}

export interface MockDrillScenarioPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MockDrillScenario[];
}

export class Language {

    title: string;
    type: string;
    pivot: {
        id: number;
        title: string;
    }
}

export interface MockDrillScenarioSingle {
    id: number;
    languages: MockDrillScenarioLanguage[];

}
export interface MockDrillScenarioLanguage {
    id: number;
    pivot: MockDrillScenarioSingleLanguage[]
}
export interface MockDrillScenarioSingleLanguage {
    mock_drill_scenario_id: string;
    language_id: number;
    title: string;
}