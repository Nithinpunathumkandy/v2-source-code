import { observable, action, computed } from "mobx-angular";

class Store{

    @observable
    private _BiaRating = [];

    @observable
    private _impactCategory = [];

    @observable
    private _impactScenario = [];

    @observable
    private _impactArea = [];

    @observable
    private _biaScale = [];

    @observable
    private _tierConfig = [];

    @action
    settierConfig(value) {
        this._tierConfig.push(value);
    }

    @action
    unsettierConfig() {
        this._tierConfig = [];
    }

    @action
    setbiaScale(value) {
        this._biaScale=value;
    }

    @action
    setImpactArea(value) {
        this._impactArea=value;
    }

    @action
    setImpactAreaArray(value) {
        this._impactArea.push(value);
    }

    @action
    setImpactScenario(value) {
        this._impactScenario.push(value);
    }

    @action
    setImpactScenarioArray(value) {
        this._impactScenario = value;
    }

    @action
    setBiaRating(value) {
        this._BiaRating.push(value);
    }

    @action
    set_impactCategory(value) {
        this._impactCategory.push(value);
    }

    @computed
    get tierConfig():any[] {

        return this._tierConfig;
    }

    @computed
    get biaScale():any[] {

        return this._biaScale;
    }

    @computed
    get impactArea():any[] {

        return this._impactArea;
    }

    @computed
    get impactScenario():any[] {

        return this._impactScenario;
    }

    @computed
    get impactCategory():any[] {

        return this._impactCategory;
    }

    @computed
    get BiaRating():any[] {

        return this._BiaRating;
    }

}

export const BiaMatrixStore = new Store()