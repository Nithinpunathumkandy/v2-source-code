import { action, computed, observable } from "mobx";
import { ActivityLog } from "src/app/core/models/acl/activity-log";
import { SystemLog } from "src/app/core/models/acl/system.logs";

class Store{
    @observable
    private _systemLog:SystemLog[] = [];

    @observable
    private _systemDashbordLog:SystemLog = null;

    systemLogString:string = null;

    systemLogParsed: SystemLog[] = [];

    @observable
    private _systemLogDetails;

    @observable
    loaded:boolean =false;

    @observable
    detailsLoaded:boolean =false;

    @observable
    orderItem: string = 'system_module';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';
    
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @computed
    get allItems(): SystemLog[]{
        return this._systemLog;
    }

    @action
    setSystemLog(response){
        this._systemLog = response;
        this.systemLogString = JSON.stringify(this._systemLog);
        this.loaded = true;
    }

    @computed
    get systemLogDetails(): SystemLog[]{
        return this._systemLogDetails;
    }

    @action
    setSystemLogDetails(response){
        this._systemLogDetails = response;
        this.detailsLoaded = true;
    }

    @action
    initializeArray(){
        this.systemLogParsed = JSON.parse(this.systemLogString);
    }

    @action
    setSearchResult(res: SystemLog[]){
        this._systemLog = res;
    }

    //system log dashboard amchart
    @action
    setSystemLogDashboard(res: SystemLog) {
        this._systemDashbordLog = res;
    }

    @action
    unsetSystemLogDashboard() {
        this._systemDashbordLog = null;
    }

    @computed
    get SystemLog():SystemLog{
        return this._systemDashbordLog;
    }
}

export const SystemLogStore = new Store();