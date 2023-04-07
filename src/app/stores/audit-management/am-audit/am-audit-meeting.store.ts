import { observable, action, computed } from "mobx-angular";
import { AmMeeting, AmMeetingPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit-meeting";
// import { AmAudit, AmAuditPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit";
// import { AmMeeting, AmMeetingPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-information-request";
import { Image } from "src/app/core/models/image.model";
// import {AuditPaginationResponse, IndividualAudit } from 'src/app/core/models/audit-management/am-audit-plan';
class Store {
    @observable
    private _auditMeetingList = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'am_meetings.reference_code';

    @observable
    private _individualAuditMeetingDetails: AmMeeting;

    @observable
    individual_audit_meeting_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    auditMeetingId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @action
    setAuditMeetingDetails(response: AmMeetingPaginationResponse) {
        this._auditMeetingList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }



    @computed
    get meetings(){

        return this._auditMeetingList.slice();
    }

    getAuditMeetingById(id: number): AmMeeting {
        let auditList;

        auditList = this._auditMeetingList.slice().find(e => e.id == id);
        this.setIndividualAuditMeetingDetails(auditList);
        return auditList;
    }

    @action
    setIndividualAuditMeetingDetails(details:AmMeeting) {
        this.individual_audit_meeting_loaded = true;
        this._individualAuditMeetingDetails = details;
        // this.updateAudit(details);
    }

    unsetIndiviudalAuditDetails() {
        this._individualAuditMeetingDetails = null;
        this.individual_audit_meeting_loaded = false;
    }
   
    @computed
    get individualMeetingDetails(): AmMeeting {
        return this._individualAuditMeetingDetails;
    }


    @computed
    get docDetails(): Image[] {
        return this._documentDetails.slice();
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
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    setAuditId(id){
        this.auditMeetingId = id;
    }

    unsetAuditId(){
        this.auditMeetingId = null;
    }



}

export const AmAuditMeetingStore = new Store();