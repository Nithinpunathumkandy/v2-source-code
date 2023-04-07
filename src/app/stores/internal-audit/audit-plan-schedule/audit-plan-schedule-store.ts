

import { observable, action, computed } from "mobx-angular";

import { AuditableItems, Schedules,MsTypeClauses, SchedulesPaginationResponse } from 'src/app/core/models/internal-audit/audit-plan-schedule/audit-plan-schedule';
import { AuditCheckList } from 'src/app/core/models/masters/internal-audit/audit-check-list';
import { Image } from "src/app/core/models/image.model";
import { AuditableItem } from 'src/app/core/models/internal-audit/auditable-item/auditable-item';

class Store {

    @observable
    auditLoaded: boolean = false;

    @observable
    private _auditableItems: AuditableItems[] = [];

    @observable
    private _auditSchedules: Schedules[] = [];
    
    @observable
    private _msTypeClauseList: MsTypeClauses[] = [];
    msTypeClauseLoaded:boolean=false;

    @observable
    loaded: boolean = false;

    checkListArray=[];

    $observable
    new_schedule_id: number = null;


    @observable
    individualLoaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    planId: number;

    @observable
    itemsPerPage: number = null;

    @observable
    individualAuditSchedule: Schedules;

    @observable
    orderItem: string = 'audit_plan_schedules.title';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;


    @observable
    last_page: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    audit_program_id: number = null;


    @observable

    audit_plan_schedule_id: number = null;

    @observable
    selectedAUdittableList: AuditableItem[] = [];

    @observable
    selectedChecklist: AuditCheckList[] = [];

    @observable
    auditableItemToDisplay: any = [];

    @observable

    checklistToDisplay: any = [];

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    startDate: any;
    endDate:any;

    @observable
    organizations = [];
    sections = [];
    subSections = [];
    departments = [];
    divisions = [];
    auditPlanStartDate = null;
    auditPlanEndDate = null;
    auditProgramTitle = null;
    auditPlanTitle = null;
    auditLeaderID = null;
    planActualStartDate = null;
    planActualEndDate = null;
    auditProgramId = null;

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action

    clearPlanDetails() {
        this.organizations = [];
        this.sections = [];
        this.subSections = [];
        this.departments = [];
        this.divisions = [];
        this.auditPlanStartDate = null;
        this.auditPlanEndDate = null;
        this.auditProgramTitle = null;
        this.auditPlanTitle = null;
        this.auditLeaderID = null;
        this.planActualStartDate = null;
        this.planActualEndDate = null;
    }
    @action
    setDocumentDetails(details: Image, url: string) {

        this._documentDetails.push(details);
        this.preview_url = url;

    }


    @action
    unsetDocumentDetails(token?: string) {

        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
        //this._brocureDetails = null;
        //this.brochure_preview_url = null;



    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setIndividualAuditSchedule(schedule: Schedules) {

        this.individualAuditSchedule = schedule;
        this.individualLoaded = true;

    }

    @action
    addSelectedAuditableItem(auditableItem, auditableItemToDisplay) {
        this.selectedAUdittableList = auditableItem;
        this.auditableItemToDisplay = auditableItemToDisplay;
    }



    @action
    unSelectAuditableItem() {
        this.selectedAUdittableList = [];
        this.auditableItemToDisplay = [];
    }



    @action
    addSelectedChecklist(checklist, checklistToDisplay) {
        this.selectedChecklist = checklist;
        this.checklistToDisplay = checklistToDisplay;
    }

    @action
    unSelectChecklist() {
        this.selectedChecklist = [];
        this.checklistToDisplay = [];
    }

    @action
    setAuditPlanScheduleId(id: number) {
        this.audit_plan_schedule_id = id;
    }



    @action
    setAuditPlanSchedule(response: SchedulesPaginationResponse) {


        this._auditSchedules = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAllAuditPlanSchedule(schedule: Schedules[]) {

        this._auditSchedules = schedule;
        this.loaded = true;

    }

    @action
    setIndividualAuditableItem(audit: AuditableItems[]) {

        this._auditableItems = audit;
        this.auditLoaded = true;

    }

    @action
    setAllAuditableItem(audit: AuditableItems[]) {

        this._auditableItems = audit;
        this.auditLoaded = true;

    }

    @computed
    get auditableItems(): AuditableItems[] {

        return this._auditableItems.slice();
    }


    @computed
    get allItems(): Schedules[] {

        return this._auditSchedules.slice();
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    getAuditPlanScheduleById(id: number): Schedules {
        return this._auditSchedules.slice().find(e => e.id == id);
    }

    get auditPlanScheduleDetails(): Schedules {
        return this.individualAuditSchedule;
    }

    // MS Type Clauses Function Starts Here

    @action
    setMsTypeClauses(data: MsTypeClauses[]) {
        this._msTypeClauseList = data
        this.msTypeClauseLoaded = true;
    }


    @computed
    get msTypeClauses(): MsTypeClauses[] {
        return this._msTypeClauseList
    }

    @action 
    clearMsTypeClauses() {
        this._msTypeClauseList = [];
        this.msTypeClauseLoaded = false;
    }


}

export const AuditPlanScheduleMasterStore = new Store();

