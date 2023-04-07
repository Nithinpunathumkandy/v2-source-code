
import { action, computed, observable } from "mobx-angular";
import { AssetReport, AssetReportDetails, AssetReportDetailsPaginationResponse, AssetReportList } from "src/app/core/models/asset-management/asset-report/asset-report";

class Store {
    reportLists: AssetReportList[] = [
        
        { 
            id: '1', 
            title: 'asset_report_by_statuses', 
            type: 'asset-report-by-statuses', 
            reportType: 'asset', 
            endurl: 'asset-report-by-statuses', 
            assetItemId: 'asset_status_ids', 
            assetTypeValue: 'asset_status', 
            tabletiltle: 'asset_statuses', 
            activityname: '',
            listPermission: ''
        },
        { 
            id: '2', 
            title: 'asset_report_by_types', 
            type: 'asset-report-by-types', 
            reportType: 'asset', 
            endurl: 'asset-report-by-types', 
            assetItemId: 'asset_type_ids', 
            assetTypeValue: 'asset_type',
            tabletiltle: 'asset_types', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '3', 
            title: 'asset_report_by_categories', 
            type: 'asset-report-by-categories', 
            reportType: 'asset', 
            endurl: 'asset-report-by-categories', 
            assetItemId: 'asset_category_ids', 
            assetTypeValue: 'asset_category',
            tabletiltle: 'asset_categories', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '4', 
            title: 'asset_report_by_custodians', 
            type: 'asset-report-by-custodians', 
            reportType: 'asset', 
            endurl: 'asset-report-by-custodians', 
            assetItemId: 'asset_custodian_ids', 
            assetTypeValue: 'asset_custodian',
            tabletiltle: 'asset_custodians', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '5', 
            title: 'asset_report_by_purchased_year', 
            type: 'asset-report-by-purchased-year', 
            reportType: 'asset', 
            endurl: 'asset-report-by-purchased-year', 
            assetItemId: 'asset_purchased_year_ids', 
            assetTypeValue: 'year',
            tabletiltle: 'asset_purchased_year', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '6', 
            checkLevel: 'is_department',
            title: 'asset_report_by_departments', 
            type: 'asset-report-by-departments', 
            reportType: 'asset', 
            endurl: 'asset-report-by-departments', 
            assetItemId: 'asset_department_ids', 
            assetTypeValue: 'department',
            tabletiltle: 'asset_department', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '7', 
            checkType: 'is_criticality',
            title: 'asset_report_by_criticality_ratings', 
            type: 'asset-report-by-criticality-ratings', 
            reportType: 'asset', 
            endurl: 'asset-report-by-criticality-ratings', 
            assetItemId: 'asset_criticality-rating_ids', 
            assetTypeValue: 'asset_rating',
            tabletiltle: 'asset_criticality_rating', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '8', 
            checkType: 'is_maintenance',
            title: 'asset_maintenance_report_by_statuses', 
            type: 'asset-maintenance-report-by-statuses', 
            reportType: 'asset', 
            endurl: 'asset-maintenance-report-by-statuses', 
            assetItemId: 'asset_maintenance_status_ids', 
            assetTypeValue: 'asset_maintenance_status',
            tabletiltle: 'asset_maintenance_status', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '9', 
            checkType: 'is_maintenance',
            title: 'asset_maintenance_report_by_assets', 
            type: 'asset-maintenance-report-by-assets', 
            reportType: 'asset', 
            endurl: 'asset-maintenance-report-by-assets', 
            assetItemId: 'asset_maintenance_asset_ids', 
            assetTypeValue: 'asset',
            tabletiltle: 'asset_maintenance_assets', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '10', 
            checkType: 'is_maintenance',
            title: 'asset_maintenance_report_by_categories', 
            type: 'asset-maintenance-report-by-categories', 
            reportType: 'asset', 
            endurl: 'asset-maintenance-report-by-categories', 
            assetItemId: 'asset_maintenance_category_ids', 
            assetTypeValue: 'asset_category',
            tabletiltle: 'asset_maintenance_category', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '11', 
            checkType: 'is_maintenance',
            title: 'asset_maintenance_report_by_types', 
            type: 'asset-maintenance-report-by-types', 
            reportType: 'asset', 
            endurl: 'asset-maintenance-report-by-types', 
            assetItemId: 'asset_maintenance_type_ids', 
            assetTypeValue: 'asset_maintenance_type_title',
            tabletiltle: 'asset_maintenance_types', 
            activityname: '',
            listPermission: '' 
        },
        { 
            id: '12', 
            checkType: 'is_maintenance',
            title: 'asset_maintenance_report_by_frequencies', 
            type: 'asset-maintenance-report-by-frequencies', 
            reportType: 'asset', 
            endurl: 'asset-maintenance-report-by-frequencies', 
            assetItemId: 'asset_maintenance_frequency_ids', 
            assetTypeValue: 'asset_maintenance_schedule_frequency_title',
            tabletiltle: 'asset_maintenance_frequency', 
            activityname: '',
            listPermission: '' 
        },
        
           
    ];

    @observable
    private _assetReportsList: AssetReport[] = [];

    @observable
    private _assetReportsCountDetails: AssetReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_asset_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    assetId: string;

    @observable
    currentDate=new Date();

    @observable
    assetReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: AssetReportList = null;

    @action
    setAssetReportDetails(response: any) {
        this._assetReportsList = response;
        this.reportloaded = true;
    }

    @action
    setAssetReportsCountDetails(response: AssetReportDetailsPaginationResponse) {
        this._assetReportsCountDetails = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.listloaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setAssetReportDetailsListingTableTitle(assetReportDetailsListingTableTitle: string) {
        this.assetReportDetailsListingTableTitle = `Asset by ${assetReportDetailsListingTableTitle}`;
    }

    @action
    AssetReportlistmakeEmpty() {
        this._assetReportsList = [];
        this.reportloaded = false;
    }

    @action
    AssetReportDetailslistmakeEmpty() {
        this._assetReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setAssetId(id: string) {
        this.assetId = id;
    }

    @computed
    get getAssetReportDetailsListingTableTitle(): string {
        
        return this.assetReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): AssetReport[] {

        return this._assetReportsList.slice();
    }

    @computed
    get AssetReportsItemsDetails(): AssetReportDetails[] {

        return this._assetReportsCountDetails.slice();
    }

    @computed
    get AssetReportListArray(): AssetReportList[] {

        return this.reportLists;
    }


}

export const AssetReportStore = new Store();