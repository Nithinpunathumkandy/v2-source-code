import { CreatedBy } from "../bpm/controls/controls";


export interface cyberIncidentIA {
    created_at: string;
    created_by: CreatedBy;
    money_total: number;
    total_performance: number;
    total_time: number;
    data: any[];
}