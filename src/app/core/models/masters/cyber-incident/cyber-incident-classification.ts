export interface CyberIncidentClassification {
    id: number;
    cyber_incident_classification_title: string;
    status_id: number;
    status: string;
    status_label: string;
}

export interface CyberIncidentClassificationResponse {
    current_page: number;
    total: number;
    per_page: number;
    from: number;
    last_page: number;
    data: CyberIncidentClassification[];
}

export interface CyberIncidentClassificationSingle {
    id: number;
    cyber_incident_classification_title: string;
    languages: CyberIncidentClassificationLanguage[];
    
}
export interface CyberIncidentClassificationLanguage{
    id:number;
    pivot:CyberIncidentClassificationSingleLanguage[]
}
export interface CyberIncidentClassificationSingleLanguage{
    id: string;
    language_id: number;
    title: string;
}