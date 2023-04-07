import { observable, action, computed } from 'mobx-angular';
import { ObjectiveResponse ,Objectives} from 'src/app/core/models/strategy-management/strategy.model';
class store {
    @observable
    currentPage: number = 1;

    @observable
    currentPageRev: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    itemsPerPageRev: number = null;

    @observable
    orderItem: string = 'stratergy.title';

    @observable
    selectedTab: string = 'object';

    @observable
    totalItems: number = null;

    @observable
    type: string = null;

    @observable
    commentForm :boolean = false

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    from: number = null;

    @observable
    _objectives : Objectives[] = [];

    @observable
    loaded: boolean = false;

    @observable
    _induavalObjective = null;

    @observable
    _induavalReview = null;

    @observable
    induvalObjectiveLoaded = false;

    @observable
    _kpiReviews = []

    @observable
    selectedobjectiveId = null


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setObjective(response : ObjectiveResponse ){
        this._objectives = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetObjectives() {
        this._objectives = null;
        this.loaded = false;
    }

    @action
    setInduvalObjective(data) {
        this._induavalObjective = data;
        this.induvalObjectiveLoaded = true
    }

    @action
    setInduvalReview(data) {
        this._induavalObjective = data;
        this.induvalObjectiveLoaded = true
    }

    get allItems(){
        return this._objectives
    }

  @computed
  get induvalObjective() {
      return this._induavalObjective
  }

}
export const ObjectiveScoreStore = new store()