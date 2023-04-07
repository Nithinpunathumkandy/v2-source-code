import { action, computed, observable } from "mobx-angular";
import { Bia, BiaAsstes, BiaList, BiaPaginationResponse, impact_result, ResourceRequirement, software, softwarePagination, TopCounts } from "src/app/core/models/bcm/bia/bia";

class Store{
    @observable
    private _bia: Bia;

    @observable
    private _biaAssets: BiaAsstes;

    @observable
    private _topCounts: TopCounts;

    @observable
    private _resourceRequirement: ResourceRequirement;

    @observable
    private _ImpactResult: impact_result;

    @observable
    private _biaList: BiaList[]=[];

    @observable
    private _biaFullList: BiaList[]=[];

    @observable
    private _softwareList: software[]=[];

    @observable
    private _hardwareList: software[]=[];

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    ImpactResultLoaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'processes.id';

    @observable
    BiaLoaded: boolean = false;

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
    selectedProcessId: number = null;

    @observable
    selectedProcessTitle: number = null;

    @observable
    selectedBiaId: number = null;

    @observable
    ImpactResultId: number = null;

    @observable
    selectedId:number = null;

    @observable
    is_edit: boolean=false;

    @observable
    businessAnalysisId: number = null;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setBia(res:Bia) {
        this.BiaLoaded = true;
        this._bia=res;
        this.businessAnalysisId = res.analysis_id
    }

    @action
    setBiaAssets(res:BiaAsstes) {
        // this.BiaLoaded = true;
        this._biaAssets=res;
    
    }

    @action
    unsetBia(){
        this._biaList = [];
        this.loaded = false;
    }

    @action
    setTopCounts(res:TopCounts) {
     
        this._topCounts=res;
    }

    @action
    setBiaFullList(res:BiaList[]) {
     
        this._biaFullList=res;
    }

    @action
    unsetImpactResult(){
        this.ImpactResultLoaded = false;
        this._ImpactResult = null;
        this.ImpactResultId = null;
    }

    @action
    setResourceRequirement(res:ResourceRequirement) {
     
        this._resourceRequirement=res;
    }

    @action
    setImpactResult(res:impact_result) {
        this.ImpactResultLoaded = true;
        if(!Array.isArray(res)){
            this._ImpactResult=res;
            this.ImpactResultId = res.id
        }
    }

    @action
    setBiaList(res:BiaPaginationResponse) {
        this.loaded = true;
        this.currentPage = res.current_page;
        this.itemsPerPage = res.per_page;
        this.totalItems = res.total;
        this._biaList = res.data;
    }

    @action
    setSoftware(res:softwarePagination) {
        // this.loaded = true;
        this.currentPage = res.current_page;
        this.itemsPerPage = res.per_page;
        this.totalItems = res.total;
        this._softwareList = res.data;
    }

    @action
    setHardware(res:softwarePagination) {
        // this.loaded = true;
        this.currentPage = res.current_page;
        this.itemsPerPage = res.per_page;
        this.totalItems = res.total;
        this._hardwareList = res.data;
    }

    @computed
    get ResourceRequirement(): ResourceRequirement {
        return this._resourceRequirement
    }

    @computed
    get ImpactResult(): impact_result {
        return this._ImpactResult
    }

    @computed
    get softwareList(): software[] {
        return this._softwareList.slice();
    }

    @computed
    get BiaFullList(): BiaList[] {
        return this._biaFullList.slice();
    }

    @computed
    get hardwareList(): software[] {
        return this._hardwareList.slice();
    }

    @computed
    get BiaList(): BiaList[] {
        return this._biaList.slice();
    }

    @computed
    get Bia(): Bia {
        return this._bia;
    }

    @computed
    get BiaAssets(): BiaAsstes {
        return this._biaAssets;
    }

    @computed
    get TopCounts(): TopCounts {
        return this._topCounts;
    }
}

export const BiaStore = new Store()