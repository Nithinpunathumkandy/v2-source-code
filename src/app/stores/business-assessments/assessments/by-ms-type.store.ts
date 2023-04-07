import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentByMsType, ByMsTypeSummary,GoodByMsType,AverageByMsType,BelowAverageByMsType } from 'src/app/core/models/business-assessments/assessments/by-ms-type';



class Store {

    @observable
    private _by_ms_type_summary: ByMsTypeSummary;

    @observable
    private _excellent_by_ms_type: ExcellentByMsType[] = [];

    @observable
    private _good_by_ms_type: GoodByMsType[] = [];

    @observable
    private _average_by_ms_type: AverageByMsType[] = [];

    @observable
    private _below_average_by_ms_type: BelowAverageByMsType[] = [];

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
    setByMsTypeSummary(response: ByMsTypeSummary) {

        this._by_ms_type_summary = response;
        this.summary_loaded = true;
        ByMsTypeStore.excellent_status = 'Active';
    }

    @action
    unsetByMsTypeSummary() {
        this._by_ms_type_summary = null;
        this.summary_loaded = false;
    }

    @action
    setExcellentByMsTypes(response: ExcellentByMsType[]) {

        this._excellent_by_ms_type = response;

        this.excellent_loaded = true;
    }

    @action
    setGoodByMsTypes(response: GoodByMsType[]) {

        this._good_by_ms_type = response;
        this.good_loaded = true;
    }


    @action
    setAverageByMsTypes(response: AverageByMsType[]) {

        this._average_by_ms_type = response;
        this.average_loaded = true;
    }


    @action
    setBelowAverageByMsTypes(response: BelowAverageByMsType[]) {

        this._below_average_by_ms_type = response;
        this.below_loaded = true;
    }


    @computed
    get byMsTypeSummary(): ByMsTypeSummary {

        return this._by_ms_type_summary;
    }

    @computed
    get excellentByMsType(): ExcellentByMsType[] {

        return this._excellent_by_ms_type;
    }

    @computed
    get goodByMsType(): GoodByMsType[] {

        return this._good_by_ms_type;
    }

    @computed
    get averageByMsType(): AverageByMsType[] {

        return this._average_by_ms_type;
    }

    @computed
    get belowAverageByMsType(): BelowAverageByMsType[] {

        return this._below_average_by_ms_type;
    }

}

export const ByMsTypeStore = new Store();