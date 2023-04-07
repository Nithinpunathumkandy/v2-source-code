import { observable, action, computed } from 'mobx-angular';
import { KpiResponse, KpiReviewResponse, Kpis } from 'src/app/core/models/strategy-management/kpi.model';
class Store {
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
    totalItems: number = null;

    @observable
    totalItemsRev: number = null;

    @observable
    from: number = null;

    @observable
    fromRev: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    _kpis:Kpis[] = [];

    @observable
    loaded: boolean = false;

    @observable
    _induavalKpi = null;

    @observable
    _induavalReview = null;

    @observable
    induvalKpiLoaded = false;

    @observable
    _kpiReviews = []

    @observable
    selectedKpiId = null


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setKpis(response : KpiResponse){
        this._kpis = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }


    @action
    setKpiReviews
    (response : KpiReviewResponse){
        this._kpiReviews = response.data;
        this.currentPageRev = response.current_page;
        this.itemsPerPageRev = response.per_page;
        this.totalItemsRev = response.total;
        this.fromRev = response.from;
        this.loaded = true;
    }

    @action
    setInduvalKpi(data) {
        this._induavalKpi = data;
        this.induvalKpiLoaded = true
    }

    @action
    setInduvalReview(data) {
        this._induavalKpi = data;
        this.induvalKpiLoaded = true
    }

    get allItems(){
        return this._kpis
    }

  @computed
  get induvalKpi() {
      return this._induavalKpi
  }

  
  @computed
  get kpiReviews() {
      return this._kpiReviews
  }

  @computed
  get induvalReview() {
      return this._induavalReview
  }






}
export const KpiStore = new Store();