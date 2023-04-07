import { observable, action, computed } from "mobx-angular";
import { EventDetails,EventDetailsPaginationResponse,Reports,ReportList } from "src/app/core/models/event-monitoring/event-report";

import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
class Store {
    reportLists: ReportList[] = [
        { 
            id: '1', 
            checkLevel: 'is_department',
            title: 'event_by_departments', 
            type: 'event-by-department', 
            reportType: 'eventRegister', 
            endurl: 'event-by-departments', 
            eventItemId: 'department_ids', 
            eventTypeValue: 'title', 
            tabletiltle: 'department', 
            activityname: 'EXPORT_RISK_COUNT_BY_DEPARTMENTS' 
        },
       
        { 
            id: '2', 
            title: 'event_by_types', 
            type: 'event-by-type', 
            reportType: 'eventRegister', 
            endurl: 'event-by-types', 
            eventItemId: 'event_type_ids', 
            eventTypeValue: 'title', 
            tabletiltle: 'event_types', 
            activityname: 'EXPORT_RISK_COUNT_BY_RISK_TYPES' 
        },
        
        { 
            id: '3', 
            title: 'event-by-owner', 
            type: 'event-by-owner', 
            reportType: 'eventRegister', 
            endurl: 'event-by-owners', 
            eventItemId: 'owner_ids', 
            eventTypeValue: 'first_name',
            eventTypeValue2: 'last_name', 
            tabletiltle: 'event_owner', 
            activityname: 'EXPORT_RISK_COUNT_BY_OWNERS' 
        },

        { 
            id: '4', 
            title: 'event-by-priority', 
            type: 'event-by-priority', 
            reportType: 'eventRegister', 
            endurl: 'event-by-priorities', 
            eventItemId: 'event_priority_ids', 
            eventTypeValue: 'title',
            eventTypeValue3: 'score',            
            tabletiltle: 'event_priority', 
            activityname: 'EXPORT_RISK_COUNT_BY_OWNERS' 
        },
        
        { 
            id: '5', 
            title: 'event-by-status', 
            type: 'event-by-status', 
            reportType: 'eventRegister', 
            endurl: 'event-by-statuses', 
            eventItemId: 'event_status_ids', 
            eventTypeValue: 'title', 
            tabletiltle: 'event_status', 
            activityname: 'EXPORT_RISK_COUNT_BY_STATUSES' 
        },

        { 
            id: '6', 
            title: 'change_request_by_department', 
            type: 'event-by-change-request-department', 
            reportType: 'eventTreatment', 
            endurl: 'event-change-request-by-departments', 
            eventItemId: 'department_ids', 
            eventTypeValue: 'title', 
            tabletiltle: 'change_request_department', 
            activityname: 'EXPORT_RISK_TREATMENT_COUNT_BY_STATUSES' 
        },

        { 
            id: '7', 
            title: 'change_request_by_status', 
            type: 'event-by-change-request-status', 
            reportType: 'eventTreatment', 
            endurl: 'event-change-request-by-statuses', 
            eventItemId: 'event_change_request_status_ids', 
            eventTypeValue: 'title', 
            tabletiltle: 'change_request_status', 
            activityname: 'EXPORT_RISK_TREATMENT_COUNT_BY_STATUSES' 
        },

        { 
            id: '8', 
            title: 'closure_by_department', 
            type: 'event-by-closure-department', 
            reportType: 'eventClosure', 
            endurl: 'event-closure-by-departments', 
            eventItemId: 'department_ids', 
            eventTypeValue: 'title', 
            tabletiltle: 'closure_department', 
            activityname: 'EXPORT_RISK_TREATMENT_COUNT_BY_STATUSES' 
        },

        { 
            id: '9', 
            title: 'closure_by_status', 
            type: 'event-by-closure-status', 
            reportType: 'eventClosure', 
            endurl: 'event-closure-by-statuses', 
            eventItemId: 'event_closure_status_ids', 
            eventTypeValue: 'title', 
            tabletiltle: 'closure_status', 
            activityname: 'EXPORT_RISK_TREATMENT_COUNT_BY_STATUSES' 
        },
        
    ];

   
    @observable
    private _reportsList: Reports[] = [];

    @observable
    private _eventCountDetails: EventDetails[] = [];

    @observable
    reportloaded: boolean = false;

    @observable
    listloaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    individual_event_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    eventId: string;

    @observable
    currentDate=new Date();

    @observable
    eventListingTableTitle: string;

    @observable
    selectedReportObject: ReportList = null;

    @observable
    eventReportDetailsListingTableTitle: string;

    action
    setEventReportDetailsListingTableTitle(eventReportDetailsListingTableTitle: string) {
        if(this.selectedReportObject.reportType == 'eventRegister'){
            this.eventReportDetailsListingTableTitle =  `Event by ${eventReportDetailsListingTableTitle}`

        }else if(this.selectedReportObject.reportType == 'eventTreatment'){
            this.eventReportDetailsListingTableTitle =  `Change Request by ${eventReportDetailsListingTableTitle}`

        }else if(this.selectedReportObject.reportType == 'eventClosure'){
            this.eventReportDetailsListingTableTitle =  `Event Closure by ${eventReportDetailsListingTableTitle}`
        }
    }

    @computed
    get geteventReportDetailsListingTableTitle(): string {
        
        return this.eventReportDetailsListingTableTitle;
    }

    @action
    setEventDetails(response: any) {
        this._reportsList = response;
        this.reportloaded = true;
    }

    @action
    setEventCountDetails(response: EventDetailsPaginationResponse) {
        this._eventCountDetails = response.data;
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
    setEventListingTableTitle(eventListingTableTitle: string) {
        this.eventListingTableTitle = `Event by ${eventListingTableTitle}`;
    }

    @action
    reportlistmakeEmpty() {
        this._reportsList = [];
        this.reportloaded = false;
    }

    @action
    eventtlistmakeEmpty() {
        this._eventCountDetails = [];
        this.listloaded = false;
    }

    @action
    setEventId(id: string) {
        this.eventId = id;
    }

    @computed
    get EventListingTableTitle(): string {
        
        return this.eventListingTableTitle;
    }


    @computed
    get allItems(): Reports[] {

        return this._reportsList.slice();
    }

    @computed
    get EventItemsDetails(): EventDetails[] {

        return this._eventCountDetails.slice();
    }

    @computed
    get ReportListArray(): ReportList[] {

        return this.reportLists;
    }


}

export const EventReportStore = new Store();




