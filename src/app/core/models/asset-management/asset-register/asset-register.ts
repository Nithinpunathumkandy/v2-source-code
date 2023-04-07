import { AssetCategory } from '../../masters/asset-management/asset-category';
import { AssetTypes } from '../../masters/asset-management/asset-types';
import { AssetSubCategory } from '../../masters/asset-management/asset-sub-category';
import { AssetLocation } from '../../masters/asset-management/asset-location';
import { AssetInvestmentTypes } from '../../masters/asset-management/asset-investment-types';
import { PhysicalConditionRankings } from '../../masters/asset-management/physical-condition-rankings'
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { MsType } from '../../organization/business_profile/ms-type/ms-type';
import { Department } from '../../masters/organization/department';
import { Division } from '../../masters/organization/division';
import { Section } from '../../masters/organization/section';
import { SubSection } from '../../masters/organization/sub-section';
import { Subsidiary } from '../../organization/business_profile/subsidiary/subsidiary';
import { Suppliers } from 'src/app/core/models/masters/suppliers-management/suppliers';
import { Designation } from 'src/app/core/models/masters/human-capital/designation';
import { UpdatedBy } from '../../human-capital/users/user-report';
import { Language } from '../../internal-audit/report/audit-report';
export interface AssetRegister {
    id: number;
    title: string;
    description: string;
    status: string;
    status_id: number;
    status_label: string;
}
export interface AssetRegisterPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AssetRegister[];
}

export interface AssetRegisterSaveResponse {
    id: number;
    message: string;
}

export interface IndividualAsset {
	serial_number: any;
	asset_owner: any;
	id: any;
    title: any;
    description: any;
    contains: any;
    asset_status: any;
    asset_type: AssetTypes;
    asset_category: AssetCategory;
    asset_sub_category: AssetSubCategory;
    asset_location: AssetLocation[];
    asset_investment_type: AssetInvestmentTypes;
    physical_condition_ranking: PhysicalConditionRankings;
    lifetime_month: any
    remarks: any;
    specification: any;
    asset_contains: any;
    depreciation_duration: number;
    depreciation_percentage: number;
    documents: any;
    value: number;
    lifetime_year: number;
    ms_type_organization: MsType[];
    organization: Subsidiary;
    purchased_date: any;
    division_id: Division;
    department: Department;
    supplier: Suppliers;
    custodian: Designation;
    section: Section;
    sub_section: SubSection;
    asset_value: string;
    division: {
        id: any;
        title: string;
    }
    ms_type_organizations: MsType[];
    locations: string;
    created_by: string;
    created_at: string;
    asset_locations:Location[]
    // updated_by: {
    //     image: {
    //         ext: string;
    //         size: number;
    //         thumbnail_url: string;
    //         title: string;
    //         token: string;
    //         url: string;

    //     }
    // }
    asset_documents: AssetSupportFile[]
}

export interface AssetSupportFile{

        id:number;
        ext: string;
        size: number;
        thumbnail_url: string;
        title: string;
        token: string;
        url: string;
        created_at:string;
        created_by:string;
        updated_at:string;
        updated_by:string;
        asset_id:number;


}

export interface Location{
    id:number;
    type:string;
    language:Language[]
}