import { KpiCategory } from './kpi-category';
import { Unit } from '../../general/unit';
import { KpiTypes } from '../strategy/kpi-types';

export interface Kpi{
    id:number;
    title:string;
    kpi_category_id:number;
    kpi_type_id: number,
    kpi_type: KpiTypes,
    description:string;
    documents:Documents[];
    kpi_category:KpiCategory;
    unit_id:number;
    target: number;
    unit:Unit;
    status: string;
    status_id: number;
    status_label: string;
    unit_title:string;
    is_dashboard:number;
}

export interface KpiPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Kpi[];
}

export interface Documents {
    id: number;
    token: string;
    title: string;
    ext: string;
    size: string;
    url: string;
    created_at:string;
    created_by:number;
    thumbnail_url:string;
    updated_at:string;
    updated_by:string;
    user_kpi_id:number;

}