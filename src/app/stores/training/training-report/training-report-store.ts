import { observable, action, computed } from "mobx-angular";
import { TrainingReport, TrainingReportDetails, TrainingReportDetailsPaginationResponse, TrainingReportList } from "src/app/core/models/training/training-reports/training-reports";

class Store {
    reportLists: TrainingReportList[] = [
        { 
            id: '1', 
            title: 'trainings', 
            type: 'trainings', 
            reportType: 'trainings', 
            endurl: 'training', 
            trainingItemId: 'training_ids', 
            trainingTypeValue: 'title', 
            tabletiltle: 'trainings', 
            activityname: 'EXPORT_REPORT_COMPLIANCE_COUNT_BY_SECTIONS',
            listPermission: 'EXPORT_COMPLIANCE_REGISTER'
        },
        { 
            id: '2', 
            title: 'training_by_categories', 
            type: 'training-by-categories', 
            reportType: 'training', 
            endurl: 'training-by-categories', 
            trainingItemId: 'training_category_ids', 
            trainingTypeValue: 'title', 
            tabletiltle: 'training_categories', 
            activityname: 'REPORT_TRAINING_BY_CATEGORIES',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_CATEGORIES'
        },
        { 
            id: '3', 
            title: 'training_by_competency_groups', 
            type: 'training-by-competency-groups', 
            reportType: 'training', 
            endurl: 'training-by-competency-groups', 
            trainingItemId: 'training_competency_group_ids', 
            trainingTypeValue: 'title',
            tabletiltle: 'competency_groups', 
            activityname: 'REPORT_TRAINING_BY_COMPETENCY_GROUPS',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_COMPETENCY_GROUPS' 
        },
        { 
            id: '4', 
            title: 'training_by_competencies', 
            type: 'training-by-competencies', 
            reportType: 'training', 
            endurl: 'training-by-competencies', 
            trainingItemId: 'training_competency_ids', 
            trainingTypeValue: 'title',  
            tabletiltle: 'competencies', 
            activityname: 'REPORT_TRAINING_BY_COMPETENCIES',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_COMPETENCIES' 
        },
        { 
            id: '5', 
            title: 'training_by_statuses', 
            type: 'training-by-statuses', 
            reportType: 'training', 
            endurl: 'training-by-statuses', 
            trainingItemId: 'training_status_ids', 
            trainingTypeValue: 'title', 
            tabletiltle: 'status', 
            activityname: 'REPORT_TRAINING_BY_STATUSES',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_STATUSES' 
        },
        { 
            id: '6', 
            checkLevel: 'is_subsidiary',
            title: 'training_by_organizations', 
            type: 'training-by-organizations', 
            reportType: 'training', 
            endurl: 'training-by-organizations', 
            trainingItemId: 'organization_ids', 
            trainingTypeValue: 'organization', 
            tabletiltle: 'organization', 
            activityname: 'REPORT_TRAINING_BY_ORGANIZATIONS',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_ORGANIZATIONS' 
        },
        { 
            id: '7', 
            checkLevel: 'is_division',
            title: 'training_by_divisions', 
            type: 'training-by-divisions', 
            reportType: 'training', 
            endurl: 'training-by-divisions', 
            trainingItemId: 'division_ids', 
            trainingTypeValue: 'division', 
            tabletiltle: 'division', 
            activityname: 'REPORT_TRAINING_BY_DIVISIONS',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_DIVISIONS'
        },
        { 
            id: '8', 
            checkLevel: 'is_department',
            title: 'training_by_departments', 
            type: 'training-by-departments', 
            reportType: 'training', 
            endurl: 'training-by-departments', 
            trainingItemId: 'department_ids', 
            trainingTypeValue: 'department', 
            tabletiltle: 'department', 
            activityname: 'REPORT_TRAINING_BY_DEPARTMENTS',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_DEPARTMENTS'
        },
        { 
            id: '9', 
            checkLevel: 'is_section',
            title: 'training_by_sections', 
            type: 'training-by-sections', 
            reportType: 'training', 
            endurl: 'training-by-sections', 
            trainingItemId: 'section_ids', 
            trainingTypeValue: 'section', 
            tabletiltle: 'section', 
            activityname: 'REPORT_TRAINING_BY_SECTIONS',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_SECTIONS'
        },   
        { 
            id: '10', 
            checkLevel: 'is_sub_section',
            title: 'training_by_sub_sections', 
            type: 'training-by-sub-sections', 
            reportType: 'training', 
            endurl: 'training-by-sub-sections', 
            trainingItemId: 'sub_section_ids', 
            trainingTypeValue: 'sub_section', 
            tabletiltle: 'sub_sections', 
            activityname: 'REPORT_TRAINING_BY_SUB_SECTIONS',
            listPermission: 'EXPORT_REPORT_TRAINING_BY_SUB_SECTIONS'
        }      
    ];

    @observable
    private _trainingReportsList: TrainingReport[] = [];

    @observable
    private _trainingReportsCountDetails: TrainingReportDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    countType: string = '';

    @observable
    countListType: string = '';
    
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
    trainingReportDetailsListingTableTitle: string;

    @observable
    selectedReportObject: TrainingReportList = null;

    @action
    setTrainingReportDetails(response: any) {
        this._trainingReportsList = response;
        this.reportloaded = true;
    }

    @action
    setTrainingReportsCountDetails(response: TrainingReportDetailsPaginationResponse) {
        this._trainingReportsCountDetails = response.data;
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
    setTrainingReportDetailsListingTableTitle(trainingReportDetailsListingTableTitle: string) {
        this.trainingReportDetailsListingTableTitle = `Training by ${trainingReportDetailsListingTableTitle}`;
    }

    @action
    TrainingReportlistmakeEmpty() {
        this._trainingReportsList = [];
        this.reportloaded = false;
    }

    @action
    TrainingReportDetailslistmakeEmpty() {
        this._trainingReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setRiskId(id: string) {
        this.riskId = id;
    }

    @computed
    get getTrainingReportDetailsListingTableTitle(): string {
        
        return this.trainingReportDetailsListingTableTitle;
    }


    @computed
    get allItems(): TrainingReport[] {

        return this._trainingReportsList.slice();
    }

    @computed
    get TrainingReportsItemsDetails(): TrainingReportDetails[] {

        return this._trainingReportsCountDetails.slice();
    }

    @computed
    get TrainingReportListArray(): TrainingReportList[] {

        return this.reportLists;
    }


}

export const TrainingReportStore = new Store();




