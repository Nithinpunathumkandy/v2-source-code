import { observable, action, computed } from "mobx-angular";
import { AmAudit, AmAuditPaginationResponse } from "src/app/core/models/audit-management/am-audit/am-audit";
// import {AuditPaginationResponse, IndividualAudit } from 'src/app/core/models/audit-management/am-audit-plan';
import { AmCommencementLetter, AmCommencementLetterPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-commencement-letter';

class Store {
    @observable
    private _commencementLetters = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'audit_Plans.reference_code';

    @observable
    private _individualCommencementLetter: AmCommencementLetter;

    @observable
    individual_letter_loaded: boolean = false;

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
    letterId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @action
    setCommencementLetter(response: AmCommencementLetter[]) {
        this._commencementLetters = response;
        // this.currentPage = response.current_page;
        // this.itemsPerPage = response.per_page;
        // this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }



    @computed
    get commencementLetters(){

        return this._commencementLetters;
    }

    getAuditById(id: number): AmAudit {
        let commencementLetter;

        commencementLetter = this._commencementLetters.slice().find(e => e.id == id);
        this.setIndividualCommencementLetter(commencementLetter);
        return commencementLetter;
    }

    @action
    setIndividualCommencementLetter(details:AmCommencementLetter) {
        this.individual_letter_loaded = true;
        this._individualCommencementLetter = details;
        // this.updateAudit(details);
    }

    unsetIndiviudalCommencementLetter() {
        this._individualCommencementLetter = null;
        this.individual_letter_loaded = false;
    }

    setCommencementLetterId(id){
        this.letterId = id;
    }

    unseCommencementLetterId(){
        this.letterId = null;
    }

   
    @computed
    get individualCommencementLetter(): AmCommencementLetter {
        return this._individualCommencementLetter;
    }




}

export const AmAuditCommencementLetterStore = new Store();