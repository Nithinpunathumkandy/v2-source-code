import { observable, action, computed } from "mobx-angular";
// import { set } from 'mobx';
import { MsAuditFindingCategory, MsAuditFindingCategoryPaginationResponse, MsAuditFindingCategorySingle } from "src/app/core/models/masters/ms-audit-management/ms-audit-finding-categories";

class Store {
    @observable
    private _msAuditFindingCategory: MsAuditFindingCategory[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    lastInsertedId: number = null;

    @observable
    orderItem: string = 'ms_audit_categories.created_at';

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    @observable
    individualMsAuditFindingCategory: MsAuditFindingCategorySingle;

    // @observable
    // msAuditCategoryDetails: any;

    searchText: string;

    @observable
    selectedMsAuditFindingCategoryList: MsAuditFindingCategory[] = [];

    @observable
    saveSelected: boolean = false;

    // @observable
    // business_application_select_form_modal: boolean = false;

    @action
    setMsAuditFindingCategory(response: MsAuditFindingCategoryPaginationResponse) {

        this._msAuditFindingCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMsAuditFindingCategory() {
        this._msAuditFindingCategory = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    
    // @action
    // updateMsAuditCategory(type: MsAuditCategory) {
    //     // const types: MsAuditCategory[] = this._msAuditCategory.slice();
    //     // const index: number = types.findIndex(e => e.id == type.id);
    //     // if (index != -1) {
    //     //     types[index] = type;
    //     //     this._msAuditCategory = types;
    //     // }
    //     this.msAuditCategoryDetails=type
    // }

    @action
    setIndividualMsAuditFindingCategory(auditFindingCategory: MsAuditFindingCategorySingle) {
       
        this.individualMsAuditFindingCategory = auditFindingCategory;
        this.individualLoaded = true;
        
    }
    
    @computed
    get individualMsAuditFindingCategoryId(){
        return this.individualMsAuditFindingCategory;
    } 

    @computed
    get msAuditFindingCategorys(): MsAuditFindingCategory[] {

        return this._msAuditFindingCategory.slice();
    }
    @computed
    get msAuditFindingCategory(): MsAuditFindingCategory[] {

        return this._msAuditFindingCategory.slice();
    }

    @action
    getMsAuditFindingCategoryById(id: number): MsAuditFindingCategory {
        return this._msAuditFindingCategory.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    get LastInsertedId(): number {
        if (this.lastInsertedId)
            return this.lastInsertedId;
        else
            return null;
    }

    @action
    addSelectedMsAuditFindingCategory(issues){
        this.selectedMsAuditFindingCategoryList = issues;
    }

    unsetSelectedMsAuditFindingCategory(){
        this.selectedMsAuditFindingCategoryList = [];
    }
}

export const MsAuditFindingCategoryMasterStore = new Store();