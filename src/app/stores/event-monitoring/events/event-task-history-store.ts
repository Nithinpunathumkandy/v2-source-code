import { observable, action, computed } from "mobx-angular";
import { HistoryData , HistoryPaginationData} from "src/app/core/models/event-monitoring/events/event-task";
class Store {
    @observable
    private history: HistoryData[];    

    @observable
    historyLoaded: boolean = false;    

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderItem: string = 'event_monitor_ca.id';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';


    @action
    setHistory(response: HistoryData[]) {

        this.history = response;
        //this.currentPage = response.current_page;
        //this.itemsPerPage = response.per_page;
        //this.totalItems = response.total;
        //this.from = response.from;
        this.historyLoaded = true;
    }

    @computed
    get allItems(): HistoryData[] {
        return this.history;
    }


}

export const TaskHistoryStore = new Store();