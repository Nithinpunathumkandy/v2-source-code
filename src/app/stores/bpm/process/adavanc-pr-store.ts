import { observable, action, computed } from "mobx-angular";
import { AdvancedProcessRecovery } from "src/app/core/models/bpm/process/advance-process";

class Store {

    @observable
    private _applicationTools = [];

    @observable
    private _applicationFormTools = [];

    @observable
    private _vitalRecords = [];

    @observable
    public processLoaded:boolean=false;

    @observable
    private _advanceProcessRecovery:AdvancedProcessRecovery;

    @action
    setAdvanceProcessRecovery(user) {
        this.processLoaded = true
        this._advanceProcessRecovery = user;
    }

    @action
    setApplicationTools(user) {
        this._applicationTools.push(user);
    }

    @action
    setApplicationFormTools(user) {
        this._applicationFormTools.push(user);
    }

    @action
    unSetApplicationFormTools() {
        this._applicationFormTools = []
    }

    @action
    setVitalRecords(user) {
        this._vitalRecords.push(user);
    }

    @computed
    get advanceProcessRecovery():AdvancedProcessRecovery {

        return this._advanceProcessRecovery;
    }

    @computed
    get vitalRecords():any[] {

        return this._vitalRecords;
    }

    @computed
    get applicationFormTools():any[] {

        return this._applicationFormTools;
    }

    @computed
    get applicationTools():any[] {

        return this._applicationTools;
    }

}

export const AdvancePrStore = new Store();