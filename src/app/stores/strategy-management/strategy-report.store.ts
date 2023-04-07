import { StrategyManagementReport, StrategyManagementReportList,StrategyManagementReportDetails, StrategyManagementReportDetailsPaginationResponse } from "src/app/core/models/strategy-management/report.model";
import { observable, action, computed } from 'mobx-angular';

class Store {
    reportLists: StrategyManagementReportList[] = [
        { 
            id: '1', 
            title: 'Strategy profile by Status', 
            type: 'profile_by_status', 
            reportType: 'profile', 
            endurl: 'strategy-profile-by-statuses', 
            riskItemId: 'strategy_profile_status_ids', 
            riskTypeValue: 'title', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '2', 
            title: 'Strategy profile by organizations', 
            type: 'profile_by_organizations', 
            reportType: 'profile', 
            endurl: 'strategy-profile-by-organizations', 
            riskItemId: 'organization_ids', 
            riskTypeValue: 'organization', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '3', 
            title: 'Strategy profile by departments', 
            type: 'profile_by_departments', 
            reportType: 'profile', 
            endurl: 'strategy-profile-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '4', 
            title: 'Strategy profile by divisions', 
            type: 'profile_by_divisions', 
            reportType: 'profile', 
            endurl: 'strategy-profile-by-divisions', 
            riskItemId: 'division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '5', 
            title: 'Strategy profile by sections', 
            type: 'profile_by_sections', 
            reportType: 'profile', 
            endurl: 'strategy-profile-by-sections', 
            riskItemId: 'section_ids', 
            riskTypeValue: 'section', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '6', 
            title: 'Strategy profile by sub section', 
            type: 'profile_by_sub-section', 
            reportType: 'profile', 
            endurl: 'strategy-profile-by-sub-sections', 
            riskItemId: 'sub_section_ids', 
            riskTypeValue: 'sub_section', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '7', 
            title: 'Strategy profile focus area by strategy profiles', 
            type: 'focus_area_by_profile', 
            reportType: 'focus_area', 
            endurl: 'strategy-profile-focus-area-by-strategy-profiles', 
            riskItemId: 'strategy_profile_ids', 
            riskTypeValue: 'strategy_profile', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '8', 
            title: 'Strategy profile objective by strategy profile focus frea', 
            type: 'objective_by_focus_area', 
            reportType: 'objective', 
            endurl: 'strategy-profile-objective-by-strategy-profile-focus-areas', 
            riskItemId: 'profile_section_type_ids', 
            riskTypeValue: 'focus_area', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },   { 
            id: '9', 
            title: 'Strategy profile objective KPI by strategy profile objective ', 
            type: 'kpi_by_objective', 
            reportType: 'kpi', 
            endurl: 'strategy-profile-objective-kpi-by-strategy-profile-objectives', 
            riskItemId: 'strategy_profile_objective_ids', 
            riskTypeValue: 'objective', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '10', 
            title: 'Strategy profile objective kpi by aggregation types  ', 
            type: 'kpi_by_aggregation_types', 
            reportType: 'kpi', 
            endurl: 'strategy-profile-objective-kpi-by-aggregation-types', 
            riskItemId: 'aggregation_type_ids ', 
            riskTypeValue: 'aggregation_type', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '11', 
            title: 'Strategy profile objective kpi by kpi owners  ', 
            type: 'kpi_by_owners', 
            reportType: 'kpi', 
            endurl: 'strategy-profile-objective-kpi-by-kpi-owners', 
            riskItemId: 'kpi_owner_ids', 
            riskTypeValue: 'first_name', 
            riskTypeValue2 : 'last_name',
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '12', 
            title: 'Strategy profile objective kpi by kpi calculation types', 
            type: 'kpi_by_calculation_types', 
            reportType: 'kpi', 
            endurl: 'strategy-profile-objective-kpi-by-kpi-calculation-types', 
            riskItemId: 'kpi_calculation_type_ids ', 
            riskTypeValue: 'kpi_calculation_type', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '13', 
            title: 'Strategy profile objective kpi by kpi data types ', 
            type: 'kpi_by_data_types', 
            reportType: 'kpi', 
            endurl: 'strategy-profile-objective-kpi-by-kpi-data-types', 
            riskItemId: 'strategy_kpi_data_type_ids', 
            riskTypeValue: 'strategy_kpi_data_type', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '14', 
            title: 'Strategy profile objective kpi by strategy frequencies  ', 
            type: 'kpi_by_data_frequencies', 
            reportType: 'kpi', 
            endurl: 'strategy-profile-objective-kpi-by-strategy-review-frequencies', 
            riskItemId: 'profile_section_type_ids', 
            riskTypeValue: 'strategy_kpi_data_type', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '15', 
            title: 'Strategy initiative by strategy profiles   ', 
            type: 'initiative_by_profiles', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-strategy-profiles', 
            riskItemId: 'strategy_profile_ids', 
            riskTypeValue: 'strategy_profile', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '16', 
            title: 'Strategy initiative by strategy profile focus area', 
            type: 'initiative_by_focus_area', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-strategy-profile-focus-areas', 
            riskItemId: 'strategy_profile_focus_area_ids ', 
            riskTypeValue: 'strategy_profile_focus_area', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '17', 
            title: 'Strategy initiative by strategy profile objective ', 
            type: 'initiative_by_objective', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-strategy-profile-objectives', 
            riskItemId: 'strategy_profile_objective_ids ', 
            riskTypeValue: 'strategy_profile_objective', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '18', 
            title: 'strategy initiative by strategy initiative actions ', 
            type: 'initiative_by_actions', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-strategy-initiative-actions', 
            riskItemId: 'strategy_initiative_action_ids', 
            riskTypeValue: 'strategy_initiative_action', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '19', 
            title: 'Strategy initiative by organizations  ', 
            type: 'initiative_by_organizations', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-organizations', 
            riskItemId: 'organization_ids', 
            riskTypeValue: 'organization', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '20', 
            title: 'Strategy initiative by divisions  ', 
            type: 'initiative_by_divisions', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-divisions', 
            riskItemId: 'division_ids', 
            riskTypeValue: 'division', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '20', 
            title: 'Strategy initiative by departments  ', 
            type: 'initiative_by_departments', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-departments', 
            riskItemId: 'department_ids', 
            riskTypeValue: 'department', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '21', 
            title: 'Strategy initiative by sections  ', 
            type: 'initiative_by_sections', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-sections', 
            riskItemId: 'section_ids', 
            riskTypeValue: 'section', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '22', 
            title: 'Strategy initiative by sub sections   ', 
            type: 'initiative_by_sub_sections', 
            reportType: 'initiative', 
            endurl: 'strategy-initiative-by-sub-sections', 
            riskItemId: 'sub_section_ids', 
            riskTypeValue: 'sub_section', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },

        { 
            id: '23', 
            title: 'Startegy initiative milestone by strategy initiative    ', 
            type: 'milestone_by_initiative', 
            reportType: 'milestone', 
            endurl: 'strategy-initiative-milestone-by-strategy-initiatives', 
            riskItemId: 'strategy_initiative_ids', 
            riskTypeValue: 'strategy_initiative', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },

        { 
            id: '24', 
            title: 'Startegy initiative action plan by strategy initiative', 
            type: 'action_by_initiative', 
            reportType: 'action_plan', 
            endurl: 'strategy-initiative-action-plan-by-strategy-initiatives', 
            riskItemId: 'strategy_initiative_ids', 
            riskTypeValue: 'strategy_initiative', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },

        { 
            id: '25', 
            title: 'Startegy initiative action plan by strategy initiative milestone ', 
            type: 'action_by_milestone', 
            reportType: 'action_plan', 
            endurl: 'strategy-initiative-action-plan-by-strategy-initiative-milestones', 
            riskItemId: 'strategy_initiative_milestone_ids', 
            riskTypeValue: 'strategy_initiative_milestone', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },
        { 
            id: '26', 
            title: 'Startegy initiative Acrtionplan by status  ', 
            type: 'action_by_status', 
            reportType: 'action_plan', 
            endurl: 'strategy-initiative-action-plan-by-statuses', 
            riskItemId: 'strategy_initiative_action_plan_status_ids', 
            riskTypeValue: 'strategy_initiative_action_plan_status_title', 
            tabletiltle: 'type', 
            activityname: 'REPORT_INCIDENTS_BY_TYPES_EXPORT',
            listPermission: 'EXPORT_INCIDENT'
        },

      

    ]

    @observable
    selectedReportObject: StrategyManagementReportList = null;

    @observable
   private _strategyManagementReportsList : StrategyManagementReport[] = []

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
   strategyManagementReportDetailsListingTableTitle: string;

   @observable
   private _strategyManagementReportsCountDetails : StrategyManagementReportDetails[] = [];

    @action
    setStrategyManagementReportDetails(response: any) {
        this._strategyManagementReportsList = response;
        this.reportloaded = true;
    }

    @action
    setStrategyManagementReportDetailsListingTableTitle(incidentManagementReportDetailsListingTableTitle: string) {
        if(this.selectedReportObject.reportType == 'profile'){
            this.strategyManagementReportDetailsListingTableTitle =  `Profile by ${incidentManagementReportDetailsListingTableTitle}`
        }else if(this.selectedReportObject.reportType == 'focus_area'){
            this.strategyManagementReportDetailsListingTableTitle =  `Focus Area by ${incidentManagementReportDetailsListingTableTitle}`

        }else if(this.selectedReportObject.reportType == 'objective'){
            this.strategyManagementReportDetailsListingTableTitle =  `Objective by ${incidentManagementReportDetailsListingTableTitle}`

        }else if(this.selectedReportObject.reportType == 'kpi'){
            this.strategyManagementReportDetailsListingTableTitle =  `KPI by ${incidentManagementReportDetailsListingTableTitle}`

        }else if(this.selectedReportObject.reportType == 'initiative'){
            this.strategyManagementReportDetailsListingTableTitle =  `Initiative by ${incidentManagementReportDetailsListingTableTitle}`

        }
       
    }

    @action
    StrategyManagementReportlistmakeEmpty() {
        this._strategyManagementReportsList = [];
        this.reportloaded = false;
    }

    @action
    setStrategyManagementReportsCountDetails(response: StrategyManagementReportDetailsPaginationResponse) {
        this._strategyManagementReportsCountDetails = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.listloaded = true;
    }

    @action
    StrategyManagementReportDetailslistmakeEmpty() {
        this._strategyManagementReportsCountDetails = [];
        this.listloaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @computed
    get allItems(): StrategyManagementReport[] {

        return this._strategyManagementReportsList.slice();
    }

    
    @computed
    get StrategyManagementReportsItemsDetails(): StrategyManagementReportDetails[] {

        return this._strategyManagementReportsCountDetails.slice();
    }


    @computed
    get StrategyManagementReportListArray(): StrategyManagementReportList[] {

        return this.reportLists;
    }

    @computed
    get getStrategyManagementReportDetailsListingTableTitle(): string {
        
        return this.strategyManagementReportDetailsListingTableTitle;
    }
}
export const StrategyReportStore = new Store();
 