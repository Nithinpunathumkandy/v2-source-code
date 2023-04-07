import { action, computed, observable } from "mobx";
import { BpmBarControls, BpmBarDepartment, BpmBarOwner, BPMCounts, BpmList, BpmPaginationResponse, BPMPieChart } from "src/app/core/models/bpm/bpm-dashboard/bpm-dashboard";



class Store{

    @observable
    private _firstBpm: BpmList[] = [];

    @observable
    private _secondBpm: BpmList[] = [];

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    currentPage: number = 1;

    @observable
    currentSecondPage: number = 2;

    @observable
    itemsPerPage: number = null;

    @observable
    private _bPMCounts: BPMCounts; 

    @observable
    private _bpmPieChart: BPMPieChart[] = [];

    @observable
    dashboardLoaded: boolean = false;

    @observable
    private _bpmBarOwner: BpmBarOwner[] = [];

    @observable
    private _bpmBarControls: BpmBarControls[] = [];

    @observable
    private _bpmBarDepartment: BpmBarDepartment[] = [];

    @observable
    bpmDashboardParam: boolean = false;

    @observable
    dashboardParams: string = null;

    @action
    setBpmDashboardParam(param:boolean){
        this.bpmDashboardParam = param
    }


    @action
    setBPMCounts(res: BPMCounts) {
        this.dashboardLoaded = true
        this._bPMCounts = res;
    }

    @action
    setBpmPieChart(response: BPMPieChart[]) {
        this._bpmPieChart = response; 
    }

    @action // Sets current page for pagination
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action // Sets current page for pagination
    setCurrentSecondPage(current_page: number) {
        this.currentSecondPage = current_page;
    }

    @action
    setFirstBpm(response: BpmPaginationResponse) {
        this._firstBpm = response.data; 
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        // this.from = response.from;
    }

    @action
    setSecondBpm(response: BpmPaginationResponse) {
        this._secondBpm = response.data; 
        this.currentSecondPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        // this.from = response.from;
    }

    @action
    setBpmBarOwner(response: BpmBarOwner[]) {
        this._bpmBarOwner = response; 
    }

    @action
    setBpmBarControls(response: BpmBarControls[]) {
        this._bpmBarControls = response; 
    }

    @action
    setBpmBarDepartment(response: BpmBarDepartment[]) {
        this._bpmBarDepartment = response; 
    }

    @action
    unsetBPMCounts() {
        this._bPMCounts = null;
    }

    @action
    unsetBpmDashboardParam() {
        this.bpmDashboardParam = null;
    }

    @computed
    get BPMCounts():BPMCounts{
        return this._bPMCounts
    }

    @computed
    get BpmPieChart():BPMPieChart[]{
        return this._bpmPieChart;
    }

    @computed
    get BpmFirst():BpmList[]{
        return this._firstBpm;
    }

    @computed
    get BpmSecond():BpmList[]{
        return this._secondBpm;
    }

    @computed
    get BpmBarOwner():BpmBarOwner[]{
        return this._bpmBarOwner;
    }

    @computed
    get BpmBarControls():BpmBarControls[]{
        return this._bpmBarControls;
    }

    @computed
    get BpmBarDepartment():BpmBarDepartment[]{
        return this._bpmBarDepartment;
    }

    @computed
    get dashboardParam(){
        return this.bpmDashboardParam;
    }

    @action
    setDashboardParam(param:string){
        this.dashboardParams = param
    }

    @computed
    get dashboardParameter(){
        return this.dashboardParams;
    }

    @action
    unsetDashboardParam() {
        this.dashboardParams = null;
    }
}

export const BPMDashboardStore = new Store();