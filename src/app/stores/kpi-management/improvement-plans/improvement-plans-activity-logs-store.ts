import { observable, action, computed } from "mobx-angular";
import { ActivityLoagsPaginationResponse, IndividualActivityLoags } from "src/app/core/models/kpi-management/improvement-plans/activity-logs";

class Store{

    @observable
    private _activityLogs: IndividualActivityLoags[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setActivityLogs(response: ActivityLoagsPaginationResponse) {

        this._activityLogs = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetActivityLogs(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._activityLogs = [];
        this.itemsPerPage = null;
    }

    @computed
    get allItems(): IndividualActivityLoags[] {
        return this._activityLogs.slice();
    }

}
export const ImprovementActivityLogsStore = new Store();