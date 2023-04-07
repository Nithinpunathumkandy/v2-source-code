import { observable, action, computed } from "mobx-angular";
import { Checklist, ChecklistPaginationResponse, IndividualChecklist
      } from "src/app/core/models/compliance-management/complaince-checklist/complaince-checklist-model";
class Store {

    @observable
    private _checklist: Checklist[] = [];


    @observable
    loaded: boolean = false;


    @observable
    individualLoaded: boolean = false;

    @observable
    _individualChecklist: IndividualChecklist;

    @observable
    currentPage: number = 1;

    @observable
    checklistId: number;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    lastInsertedId:number=null;

    @observable
    last_page: number = null;

    @observable
    preview_url: string;

    @observable
    workflowCurrentPage:number=1;

    @observable
    workflowiItemsPerPage:number;

    @observable
    workflowtTotalItems:number;

    @observable
    historyLoaded:boolean=false;

    @observable
    type=''

    @observable
    orderItem: string = 'checklists.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    searchText: string;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setAllComplainceChecklist(response: ChecklistPaginationResponse) {
        this._checklist = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @computed
    get allItems(): Checklist[] {
        return this._checklist;
    }

    @action
    unsetChecklist() {
        this._checklist = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setChecklistDetails(details: IndividualChecklist) {
        this._individualChecklist = details;
        this.individualLoaded = true;
    }
    
    @computed
    get checklistDetails():IndividualChecklist {
        return this._individualChecklist;
    }

    @action
    unsetSelectedItemDetails() {
        this.individualLoaded = false;
        this._individualChecklist = null;
    }

    @action
    setChecklistId(id: number) {
        this.checklistId = id;
    }

   

   

}



export const ComplainceChecklistStore = new Store();
