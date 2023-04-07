import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ByDocumentSummary,performanceSummary } from 'src/app/core/models/business-assessments/assessments/by-document';



class Store {

    @observable
    private _by_document_summary: ByDocumentSummary;

    @observable
    private _excellent_by_document: performanceSummary[] = [];

    @observable
    private _good_by_document: performanceSummary[] = [];

    @observable
    private _average_by_document: performanceSummary[] = [];

    @observable
    private _below_average_by_document: performanceSummary[] = [];

    @observable
    excellent_loaded: boolean = false;

    @observable
    good_loaded: boolean = false;

    @observable
    average_loaded: boolean = false;

    @observable
    below_loaded: boolean = false;

    @observable
    excellent_status: string = 'Inactive';

    @observable
    good_status: string = 'Inactive';

    @observable
    average_status: string = 'Inactive';

    @observable
    below_status: string = 'Inactive';

    @observable
    summary_loaded: boolean = false;

    @action
    setByDocumentSummary(response: ByDocumentSummary) {

        this._by_document_summary = response;
        this.summary_loaded = true;
        ByDocumentStore.excellent_status = 'Active';
    }

    @action
    unsetByDocumentSummary() {
        this._by_document_summary = null;
        this.summary_loaded = false;
    }

    @action
    setExcellentByDocuments(response: performanceSummary[]) {

        this._excellent_by_document = response;

        this.excellent_loaded = true;
    }

    @action
    setGoodByDocuments(response: performanceSummary[]) {

        this._good_by_document = response;
        this.good_loaded = true;
    }


    @action
    setAverageByDocuments(response: performanceSummary[]) {

        this._average_by_document = response;
        this.average_loaded = true;
    }


    @action
    setBelowAverageByDocuments(response: performanceSummary[]) {

        this._below_average_by_document = response;
        this.below_loaded = true;
    }


    @computed
    get byDocumentSummary(): ByDocumentSummary {

        return this._by_document_summary;
    }

    @computed
    get excellentByDocument(): performanceSummary[] {

        return this._excellent_by_document;
    }

    @computed
    get goodByDocument(): performanceSummary[] {

        return this._good_by_document;
    }

    @computed
    get averageByDocument(): performanceSummary[] {

        return this._average_by_document;
    }

    @computed
    get belowAverageByDocument(): performanceSummary[] {

        return this._below_average_by_document;
    }

}

export const ByDocumentStore = new Store();