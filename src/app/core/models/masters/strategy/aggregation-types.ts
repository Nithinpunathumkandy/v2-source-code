import { LanguagePivot } from "../general/label";

export interface AggregationTypes {
    id: number;
    type: string;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
}
export interface AggregationTypesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AggregationTypes[];
}

