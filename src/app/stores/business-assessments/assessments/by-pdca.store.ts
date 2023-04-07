import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentByPdca, ByPdcaSummary,GoodByPdca,AverageByPdca,BelowAverageByPdca } from 'src/app/core/models/business-assessments/assessments/by-pdca';



class Store {

    @observable
    private _by_pdca_summary: ByPdcaSummary;

    @observable
    private _excellent_by_pdca: ExcellentByPdca[] = [];

    @observable
    private _good_by_pdca: GoodByPdca[] = [];

    @observable
    private _average_by_pdca: AverageByPdca[] = [];

    @observable
    private _below_average_by_pdca: BelowAverageByPdca[] = [];

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
    setByPdcaSummary(response: ByPdcaSummary) {

        this._by_pdca_summary = response;
        this.summary_loaded = true;
        ByPdcaStore.excellent_status = 'Active';
    }

    @action
    unsetByPdcaSummary() {
        this._by_pdca_summary = null;
        this.summary_loaded = false;
    }

    @action
    setExcellentByPdcas(response: ExcellentByPdca[]) {

        this._excellent_by_pdca = response;

        this.excellent_loaded = true;
    }

    @action
    setGoodByPdcas(response: GoodByPdca[]) {

        this._good_by_pdca = response;
        this.good_loaded = true;
    }


    @action
    setAverageByPdcas(response: AverageByPdca[]) {

        this._average_by_pdca = response;
        this.average_loaded = true;
    }


    @action
    setBelowAverageByPdcas(response: BelowAverageByPdca[]) {

        this._below_average_by_pdca = response;
        this.below_loaded = true;
    }


    @computed
    get byPdcaSummary(): ByPdcaSummary {

        return this._by_pdca_summary;
    }

    @computed
    get excellentByPdca(): ExcellentByPdca[] {

        return this._excellent_by_pdca;
    }

    @computed
    get goodByPdca(): GoodByPdca[] {

        return this._good_by_pdca;
    }

    @computed
    get averageByPdca(): AverageByPdca[] {

        return this._average_by_pdca;
    }

    @computed
    get belowAverageByPdca(): BelowAverageByPdca[] {

        return this._below_average_by_pdca;
    }

}

export const ByPdcaStore = new Store();