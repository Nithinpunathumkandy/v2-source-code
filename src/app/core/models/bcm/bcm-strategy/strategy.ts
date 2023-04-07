export interface Strategies {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id: number;
    status_label: string;
    solutions: Destails[];
}

export interface Destails {
    id: number;
    skills: any;
    people: any;
    information_and_data: any;
    buildings_and_utilities: any;
    facilities_equipment: any;
    information_and_operational_technology: any;
    transportation_and_logistics: any;
    supply_chain: any;
    duration: any;
    remarks: any;
    description: any;
    score: any;
    expense: any;
    business_continuity_strategy_finance_id: any;
    benifits: any;
    consequences: any;
    is_hour: any;
    is_day: any;
    resource_requirements: any;
}
export interface StrategiesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Strategies[];
}

export interface StrategiesHistoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: any
}