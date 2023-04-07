import { action, computed, observable } from "mobx";
import { AdvancedProcessDiscovery, CriticalOperation, ProcessWithActivities, RelatedProcesss, savedDependencies } from "src/app/core/models/bpm/process/advance-process";


class Store {
    @observable
    private _criticalProcesses: CriticalOperation

    @observable
    public processLoaded: boolean=false

    @observable
    private _advanceProcessDiscovery: AdvancedProcessDiscovery

    @observable
    private _processWithActivities: ProcessWithActivities[]

    @observable
    private _savedDependencies: savedDependencies[]=[]

    @observable
    private _relatedProcess: RelatedProcesss[]=[]

    @observable
    private _applicationFormTools = [];

    @observable
    private _asstes = []

    @observable
    private _applicationTools = [];

    @observable
    public _primaryProcessOwner;

    @action
    setApplicationTools(user) {
        this._applicationTools.push(user);
    }

    @action
    setApplicationFormTools(user) {
        this._applicationFormTools.push(user);
    }

    @action
    setAssets(user) {
        this._asstes.push(user);
    }

    @action
    unSetAssets() {
        this._asstes=[];
    }

    @action
    unSetApplicationFormTools() {
        this._applicationFormTools = []
    }

    
    @computed
    get assets():any[] {
        return this._asstes;
    }

    @computed
    get applicationFormTools():any[] {

        return this._applicationFormTools;
    }

    @computed
    get applicationTools():any[] {

        return this._applicationTools;
    }

    @observable
    currentPage: number = 1;

    @observable 
    processWithActLoaded:boolean=false;

    @observable
    process_index:number = null;

    @action
    setsavedDependencies(savedDependencies:savedDependencies[]) {
        this._savedDependencies = savedDependencies;
    }

    @action
    unSetsavedDependencies() {
        this._savedDependencies = [];
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setProcessWithActivities(res: ProcessWithActivities[]) {
        this.processWithActLoaded = true
        this._processWithActivities = res
    }

    @action
    setRelatedProcess(res: RelatedProcesss[]) {
        this._relatedProcess = res
    }

    @computed
    get relatedProcess(): RelatedProcesss[] {
        return this._relatedProcess.slice()
    }

    @computed
    get savedDependencies(): savedDependencies[] {
        return this._savedDependencies.slice()
    }

    @computed
    get processWithActivities(): ProcessWithActivities[] {
        return this._processWithActivities
    }

    @action
    setProcessDiscovery(res: AdvancedProcessDiscovery) {
        this.processLoaded = true;
        this._advanceProcessDiscovery = res
    }

    @action
    unsetProcessDiscovery() {
        this.processLoaded = false;
        this._advanceProcessDiscovery = null
    }

    @computed
    get advanceProcessDiscovery(): AdvancedProcessDiscovery {
        return this._advanceProcessDiscovery
    }
}

export const AdvanceProcessStore = new Store();