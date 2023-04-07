import { CreatedBy } from './general/created_by';
import { GeneralPivot } from './general/general-pivot';

export interface StatusDetails{
    id: number;
    label: string;
    title: StatusTitle[];
}

export interface StatusTitle{
    code: string;
    created_at: string;
    created_by: CreatedBy;
    id: number;
    is_primary: number;
    is_rtl: number;
    pivot: GeneralPivot;
    status_id: number;
    title: string;
    type: string;
}