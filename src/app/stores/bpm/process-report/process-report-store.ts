import { observable, action, computed } from "mobx-angular";
import { ProcessReports, ProcessRiskDetails, ProcessRiskDetailsPaginationResponse, ProcessReportList} from 'src/app/core/models/bpm/process-report/process-report';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: ProcessReportList[] = [
        { 
            id: '1', 
            checkLevel: 'is_department',
            title: 'process_by_department', 
            type: 'process-by-departments', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_DEPARTMENTS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '2', 
            checkLevel: 'is_division',
            title: 'process_by_division', 
            type: 'process-by-divisions', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-divisions', 
            riskItemId: 'division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'division', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_DIVISIONS',
            listPermission: 'EXPORT_PROCESS'
        },
        { 
            id: '3', 
            title: 'process_by_category', 
            type: 'process-by-categories', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-categories', 
            riskItemId: 'process_category_ids', 
            riskTypeValue: 'process_category', 
            tabletiltle: 'category', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_CATEGORIES',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '4', 
            title: 'process_by_group', 
            type: 'process-by-groups', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-groups', 
            riskItemId: 'process_group_ids', 
            riskTypeValue: 'process_group', 
            tabletiltle: 'group_id', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_GROUPS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '5', 
            title: 'process_by_internal_stakeholders', 
            type: 'process-by-internal-stakeholders', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-internal-stakeholders', 
            riskItemId: 'stakeholder_ids', 
            riskTypeValue: 'stakeholder', 
            tabletiltle: 'internal_stakeholder', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_INTERNAL_STAKEHOLDERS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '6', 
            title: 'process_by_external_stakeholders', 
            type: 'process-by-external-stakeholders', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-external-stakeholders', 
            riskItemId: 'stakeholder_ids', 
            riskTypeValue: 'risk_type', 
            tabletiltle: 'external_stakeholder', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_EXTERNAL_STAKEHOLDERS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '7', 
            title: 'process_by_responsible_users', 
            type: 'process-by-responsible-users', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-responsible-users', 
            riskItemId: 'responsible_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'responsible_user', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_RESPONSIBLE_USERS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '8', 
            title: 'process_by_accountable_users', 
            type: 'process-by-accountable-users', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-accountable-users', 
            riskItemId: 'accountable_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name',  
            tabletiltle: 'accountable_user', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_ACCOUNTABLE_USERS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '9', 
            title: 'process_by_consulted_users', 
            type: 'process-by-consulted-users', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-consulted-users', 
            riskItemId: 'consulted_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'consulted_user', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_CONSULTED_USERS',
            listPermission: 'EXPORT_PROCESS' 
        },
        { 
            id: '10', 
            title: 'process_by_informed_users', 
            type: 'process-by-informed-users', 
            reportType: 'riskRegister', 
            endurl: 'process-count-by-informed-users', 
            riskItemId: 'informed_user_ids', 
            riskTypeValue: 'first_name',
            riskTypeValue2: 'last_name', 
            tabletiltle: 'informed_user', 
            activityname: 'EXPORT_PROCESS_COUNT_BY_INFORMED_USERS',
            listPermission: 'EXPORT_PROCESS'
        },
        
        
    ];
    @observable
    private _processReportsList: ProcessReports[] = [];

    @observable
    private _processRiskCountDetails: ProcessRiskDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_risk_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    riskId: string;

    @observable
    currentDate=new Date();

    @observable
    processRiskListingTableTitle: string;

    @observable
    selectedReportObject: ProcessReportList = null;

    @action
    setProcessRiskDetails(response: any) {
        this._processReportsList = response;
        this.reportloaded = true;
    }

    @action
    setProcessRiskCountDetails(response: ProcessRiskDetailsPaginationResponse) {
        this._processRiskCountDetails = response.data;
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
    setProcessRiskListingTableTitle(processRiskListingTableTitle: string) {
        this.processRiskListingTableTitle = `Processes by ${processRiskListingTableTitle}`;
    }

    @action
    processReportlistmakeEmpty() {
        this._processReportsList = [];
        this.reportloaded = false;
    }

    @action
    processRisktlistmakeEmpty() {
        this._processRiskCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get ProcessRiskListingTableTitle(): string {
        
        return this.processRiskListingTableTitle;
    }


    @computed
    get allItems(): ProcessReports[] {

        return this._processReportsList.slice();
    }

    @computed
    get ProcessRiskItemsDetails(): ProcessRiskDetails[] {

        return this._processRiskCountDetails.slice();
    }

    @computed
    get ProcessReportListArray(): ProcessReportList[] {

        return this.reportLists;
    }


}

export const ProcessReportStore = new Store();




