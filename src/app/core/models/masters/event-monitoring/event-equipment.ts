export interface EventEquipment {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface EventEquipmentPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventEquipment[];
}
export interface EventEquipmentSingle {
    id: number;
    languages: EventEquipmentLanguage[];
    
}
export interface EventEquipmentLanguage{
    id:number;
    event_equipment:EventEquipmentSingleLanguage[]
}
export interface EventEquipmentSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}