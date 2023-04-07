
import { observable, action, computed } from "mobx-angular";
import { AssetMaintenanceSchedule, AssetMaintenanceSchedulePaginationResponse, IndividualAssetMaintenanceSchedule } from 'src/app/core/models/asset-management/asset-register/asset-schedule';

class Store {
    @observable
    private _maintenanceSchedule: AssetMaintenanceSchedule[] = [];

    @observable
    private _maintenanceScheduleHistory= [];

    @observable
    private _maintenanceShutdownHistory= [];


    @observable 
    loaded:boolean=false;

    @observable 
    loadedHistory:boolean=false;

    @observable 
    loadedShutdownHistory:boolean=false;


    @observable
    editFlag: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    currentPageHistory: number = 1;

    @observable
    currentPageShutdownHistory: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    itemsPerPageHistory: number = null;

    @observable
    itemsPerPageShutdownHistory: number = null;

    @observable
    orderItem: string = 'assets.created_at';

    @observable
    private _individualMaintenanceScheduleDetails: IndividualAssetMaintenanceSchedule;

    @observable
    individual_maintenance_schedule_loaded: boolean = false;

    @observable
    scheduleId = null;

    @observable
    totalItems: number = null;

    @observable
    totalItemsHistory: number = null;

    @observable
    totalItemsShutdownHistory: number = null;


    @observable
    from: number = null;

    @observable
    fromHistory: number = null;

    @observable
    fromShutdownHistory: number = null;

    @observable
    last_page: number = null;

    @observable
    assetId: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    searchText: string;

   
    @action
    setMaintenanceSchedule(response: AssetMaintenanceSchedulePaginationResponse) {


        this._maintenanceSchedule = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setIndividualMaintenanceSchedule(response) {

        this._individualMaintenanceScheduleDetails = response;
        this.individual_maintenance_schedule_loaded = true;
    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setScheduleId(id: number) {

        this.scheduleId = id;
    }

    @computed
    get getScheduleId() {
        return this.scheduleId;
    }

    
    @computed
    get allItems(): AssetMaintenanceSchedule[] {
        
        return this._maintenanceSchedule.slice();
    }

    @computed
    get allItemsHistory() {
        
        return this._maintenanceScheduleHistory.slice();
    }

    @computed
    get individualSchedule() {
        
        return this._individualMaintenanceScheduleDetails;
    }

    @action
    setMaintenanceScheduleHistory(response) {

        this._maintenanceScheduleHistory = response.data;
        this.currentPageHistory = response.current_page;
        this.itemsPerPageHistory = response.per_page;
        this.totalItemsHistory = response.total;
        this.fromHistory = response.from;
        this.loadedHistory = true;

    }

    @action
    setHistoryCurrentPage(current_page: number) {
        this.currentPageHistory = current_page;
    }

   

    @action
    setMaintenanceShutdownHistory(response) {

        this._maintenanceShutdownHistory = response.data;
        this.currentPageShutdownHistory = response.current_page;
        this.itemsPerPageShutdownHistory = response.per_page;
        this.totalItemsShutdownHistory = response.total;
        this.fromShutdownHistory = response.from;
        this.loadedShutdownHistory = true;

    }

    @action
    setShutdwnHistoryCurrentPage(current_page: number) {
        this.currentPageShutdownHistory = current_page;
    }

    @computed
    get allItemsShutdownHistory() {
        
        return this._maintenanceShutdownHistory.slice();
    }

    @action
     setAllItemsScheduleListDestroy() {
       this.loaded=false;
       this.currentPage=null;
       this._maintenanceSchedule=[];
    }

    @action
    setAllItemsScheduleDetailsestroy() {
      this.individual_maintenance_schedule_loaded=false;
      this._individualMaintenanceScheduleDetails=null;
      
   }

   @action
    setAllItemsScheduleHistoryClear() {
      this.loadedHistory=false;
      this._maintenanceScheduleHistory=[];
      
   }

   @action
    setAllItemsShutdownHistoryClear() {
      this.loadedShutdownHistory=false;
      this._maintenanceShutdownHistory=[];
      
   }

}

export const AssetMaintenanceScheduleStore = new Store();

