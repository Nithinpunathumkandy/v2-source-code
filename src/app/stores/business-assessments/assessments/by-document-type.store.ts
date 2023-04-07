import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentByDocumentType, ByDocumentTypeSummary,GoodByDocumentType,AverageByDocumentType,BelowAverageByDocumentType } from 'src/app/core/models/business-assessments/assessments/by-document-type';



class Store {

    @observable
    private _by_document_type_summary: ByDocumentTypeSummary;

    @observable
    private _excellent_by_document_type: ExcellentByDocumentType[] = [];

    @observable
    private _good_by_document_type: GoodByDocumentType[] = [];

    @observable
    private _average_by_document_type: AverageByDocumentType[] = [];

    @observable
    private _below_average_by_document_type: BelowAverageByDocumentType[] = [];

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
    setByDocumentTypeSummary(response: ByDocumentTypeSummary) {

        this._by_document_type_summary = response;
        this.summary_loaded = true;
        ByDocumentTypeStore.excellent_status = 'Active';
    }

    @action
    unsetByDocumentTypeSummary() {
        this._by_document_type_summary = null;
        this.summary_loaded = false;
    }

    @action
    setExcellentByDocumentTypes(response: ExcellentByDocumentType[]) {

        this._excellent_by_document_type = response;

        this.excellent_loaded = true;
    }

    @action
    setGoodByDocumentTypes(response: GoodByDocumentType[]) {

        this._good_by_document_type = response;
        this.good_loaded = true;
    }


    @action
    setAverageByDocumentTypes(response: AverageByDocumentType[]) {

        this._average_by_document_type = response;
        this.average_loaded = true;
    }


    @action
    setBelowAverageByDocumentTypes(response: BelowAverageByDocumentType[]) {

        this._below_average_by_document_type = response;
        this.below_loaded = true;
    }


    @computed
    get byDocumentTypeSummary(): ByDocumentTypeSummary {

        return this._by_document_type_summary;
    }

    @computed
    get excellentByDocumentType(): ExcellentByDocumentType[] {

        return this._excellent_by_document_type;
    }

    @computed
    get goodByDocumentType(): GoodByDocumentType[] {

        return this._good_by_document_type;
    }

    @computed
    get averageByDocumentType(): AverageByDocumentType[] {

        return this._average_by_document_type;
    }

    @computed
    get belowAverageByDocumentType(): BelowAverageByDocumentType[] {

        return this._below_average_by_document_type;
    }

}

export const ByDocumentTypeStore = new Store();