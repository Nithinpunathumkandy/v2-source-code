
import { observable, action, computed } from 'mobx-angular';
import { StrategyProfileResponse, ObjectiveResponse,Objectives } from 'src/app/core/models/strategy-management/strategy.model';
class Store {

    @observable
   private _objectives :Objectives[] = []
   
   @observable
    loaded = false

   @observable
   currentPage: number = 1;

   @observable
   itemsPerPage: number = null;

   @observable
   orderItem: string = 'strategy_reviews.title';

   @observable
   totalItems: number = null;

   @observable
   from: number = null;

   @observable
   searchText: string;

   @observable
   last_page: number = null;

   @observable
   orderBy: 'asc' | 'desc' = 'asc';

   @observable
   _mileStoneId : number = null

   @action
   setCurrentPage(current_page: number) {
       this.currentPage = current_page;
   }

    @action
    setObjectives(response: ObjectiveResponse ) {
        
  
        this._objectives = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }
    

    @action
    setMileStoneId(id){
        this._mileStoneId = id
    }

    @computed
    get selectedMilestoneId(){
        return this._mileStoneId
    }

    @computed
    get allItems(): Objectives[] {
        return this._objectives.slice();
    }

}
export const StrategyReviewStore = new Store();
