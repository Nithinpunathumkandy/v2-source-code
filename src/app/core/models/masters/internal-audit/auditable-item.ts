import { AuditableItemCategory } from './auditable-item-category';
import { AuditableItemType } from './auditable-item-type';
import { RiskRating } from '../external-audit/risk-rating';
import { AuditCheckList } from './audit-check-list';
import { Department } from 'src/app/core/models/masters/organization/department';
import { Division } from '../organization/division';
import { MsType } from '../organization/ms-type';
import { Section } from '../organization/section';
import { SubSection } from '../organization/sub-section';
import { ControlCategory } from '../bpm/conrol-category';
import { Organization } from '../../organization.model';

export interface AuditableItem {
    id: number;
    reference_code:number;
    auditable_item_category: AuditableItemCategory;
    auditable_item_type:AuditableItemType;
    risk_rating: RiskRating;
    title: string;
    description:string;
    auditable_item_controls: ControlCategory[];
    auditable_item_checklists: AuditCheckList[];
    auditable_item_departments: Department[];
    auditable_item_divisions: Division[];
    auditable_item_ms_type_organizations: MsType[];
    auditable_item_organizations: Organization[];
    auditable_item_sections: Section[];
    auditable_item_sub_sections : SubSection[];
    documents: Documents[];
    is_deleted: boolean;
    image_token: string;
    created_at:string;
}

export interface AuditableItemPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from:number;
    data: AuditableItem[];
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
    user_job_id:string;
}


export interface Image {
    title: String;
    url: string;
    thumbnail_url: string
    token: string;
    size: number;
    ext: string;
}
