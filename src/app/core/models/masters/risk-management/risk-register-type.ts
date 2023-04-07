import { Title } from "@angular/platform-browser";
import { Languages } from "../general/label";

export interface RiskRegisterTypes {
    risk_rating_values: any;
    type: any;
    id: number;
    risk_rating_language_title: string;
    title: string;
    status: string;
    status_id :number;
    status_label: string;
    score_from:number;
    score_to:number;
    language_id:number;
    risk_treatment:string;
    language:Languages;
    label:string;
}

export interface RiskRegisterTypesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: RiskRegisterTypes[];
}

export interface RiskRegisterTypesByLanguage{
    language:string;
    language_id:number;
    risk_ratings:RiskRegisterTypes[];
}