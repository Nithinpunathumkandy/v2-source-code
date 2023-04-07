import { observable, action, computed } from 'mobx-angular';
import { IncidentCount } from 'src/app/core/models/incident-management/incident-dashboard/incident-dashboard';
import { StrategyCount } from 'src/app/core/models/strategy-management/dashbord.model';

class Store  {

    @observable
    _strategyCountDetails : StrategyCount = null;

    @observable
    _strategyProfiles  = [];

    @observable
    currentPage: number = 1;

    @observable
    currentKPIPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    itemsPerKPIPage: number = null;

    @observable
    orderItem: string = 'strategy_profiles.reference_code';

    @observable
    totalItems: number = null;

    @observable
    totalKPIItems: number = null;

    @observable
    from: number = null;

    @observable
    fromKPI: number = null;

    @observable
    last_page: number = null;

    @observable
    last_page_kpi: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderByKPI: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @observable
    _totalBudgetvsActual = null

    @observable
    _profileStatusByDepartment = null

    @observable
    _achivedVsTarget = null

    @observable
    _induvalProfile = null

    @observable
    _profileCounts = null

    @observable
    _kpiScoreCount = null

    @observable
    _profileObjectives = null

    @observable
    _profileInitiatives = null

    @observable
    statusType = null

    @observable
    selectedOnGoingProfile = null;

    @observable
    objectiveId = null;

    @observable
    riskStatusId = null;
    
    @action
    setStrategyCountDetails(response: StrategyCount) {
         this._strategyCountDetails = response; 
    }

    @action
    setTotalBudgetvsActual(response) {
         this._totalBudgetvsActual = response; 
    }

    @action
    setProfileStatusByDepartment(response) {
         this._profileStatusByDepartment = response; 
    }

    @action
    setAchivedVsTarget(response) {
         this._achivedVsTarget = response; 
    }

    @action
    setInduvalProfileDetails(response) {
         this._induvalProfile = response; 
    }

    @action
    unsetInduvalProfileDetails() {
         this._induvalProfile = null; 
    }

    @action
    setProfileCounts(response) {
         this._profileCounts = response; 
    }

    @action
    setKpiScoreCounts(response) {
         this._kpiScoreCount = response.data; 
         this.currentKPIPage = response.current_page;
         this.itemsPerKPIPage = response.per_page;
         this.totalKPIItems = response.total;
         this.fromKPI = response.from;
    }

    @action
    setObjectives(response) {
         this._profileObjectives = response.data; 
        //  this.currentKPIPage = response.current_page;
        //  this.itemsPerKPIPage = response.per_page;
        //  this.totalKPIItems = response.total;
        //  this.fromKPI = response.from;
    }

    @action
    setInitiatives(response) {
         this._profileInitiatives = response.data; 
    }

    @action
    setStrategyProfiles(response) {
         this._strategyProfiles = response.data; 
         this.currentPage = response.current_page;
         this.itemsPerPage = response.per_page;
         this.totalItems = response.total;
         this.from = response.from;
    }

    @action
  setCurrentPage(current_page: number) {
      this.currentPage = current_page;
  }

  @action
  setKPICurrentPage(current_page: number) {
      this.currentKPIPage = current_page;
  }



    @computed
    get kpiScoreCount(){
        return this._kpiScoreCount
    }

    @computed
    get profileCounts(){
        return this._profileCounts;
    }

    @computed
    get induvalProfile(){
        return this._induvalProfile;
    }

    @computed
    get achivedVsTarget(){
        return this._achivedVsTarget;
    }

    @computed
    get totalBudprofileStatusByDepartment(){
        return this._profileStatusByDepartment;
    }

   
    get strategyProfiles(){
        return this._strategyProfiles;
    }

    get strategyObjectives(){
        return this._profileObjectives;
    }

    get strategyInitiatives(){
        return this._profileInitiatives;
    }

    @computed
    get totalBudgevsActual(){
        return this._totalBudgetvsActual;
    }

    @computed
    get strategyCountDetails():StrategyCount{
        return this._strategyCountDetails;
    }
}
export const StrategyDaashboardStore = new Store();