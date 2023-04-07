import { computeDigest } from "@angular/compiler/src/i18n/digest";
import { observable, action, computed } from "mobx-angular";
import { EventChangeRequest, EventChangeRequestDetails, EventChangeRequestResponse } from "src/app/core/models/event-monitoring/events/event-change-request";

class Store {
    @observable
    private _changeRequests: EventChangeRequest[] = [];

    @observable
    private _changeRequestLists: EventChangeRequest[] = [];

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'event_change_request.created_at';

    @observable
    individualLoaded: boolean = false;


    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    eventDateSelected: boolean = false;

    eventBudgetSelected: boolean = false;

    eventScopeSelected: boolean = false;

    eventStatusSelected: boolean = false;

    @observable
    _individualChangeRequestItem:EventChangeRequestDetails = null

    @observable
    selectedTabs = []

    scopeOfWorks = []

    @observable
    selectedCRId = null

    @observable
    _budgets = [];

    @observable
    changeRequestChoosedSubmenu : boolean = false;

    @action
    setEventChangeRequests(response: EventChangeRequestResponse) {
        this._changeRequests = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setEventChangeRequestLists(response: EventChangeRequestResponse) {
        this._changeRequestLists = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    changeRequestById(id: number): EventChangeRequest{
        return this._changeRequests.find(e => e.id == id);
    }

    @action
    setIndividualItem(data){
      this._individualChangeRequestItem = data;
      this.individualLoaded = true
    }
   
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setBudgets(data){
        this._budgets.push(data)
    }

    @action
    unSetBudgets(){
        this._budgets=[]
    }

    @action
    setMenuChoosedListingSubmenu(){
        this.changeRequestChoosedSubmenu=true;
    }

    @action
    updateExistingValue(data)
    {
        const index=this._budgets.findIndex(e=>e.year==data.year)
        if(index>-1)
        {
            if(this._budgets[index].type=='deleted')
            {   
                this._budgets[index].type='existing'
                this._budgets[index].newAmount=data.amount
               
            }
            else{
                this._budgets[index].newAmount=data.amount
            }
        }
       
    }

    @computed
    get budgets(){
        return this._budgets
      }

    @computed
    get allItems(): EventChangeRequest[] {
        return this._changeRequests.slice();
    }

    @computed
    get changeRequests(): EventChangeRequest[] {
        return this._changeRequestLists.slice();
    }

    @computed
    get individualChangeRequestItem(){
        return this._individualChangeRequestItem
    }

    @action
    unsetDetails(){
        this._individualChangeRequestItem = null;
        this.individualLoaded = false;
    }

    @action
    unsetMenuChoosedListingSubmenu(){
        this.changeRequestChoosedSubmenu=false;
    }


}
export const EventChangeRequestStore = new Store();
