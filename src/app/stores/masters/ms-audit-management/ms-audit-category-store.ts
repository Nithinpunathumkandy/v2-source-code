import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MsAuditCategory, MsAuditCategoryPaginationResponse, MsAuditCategorySingle } from "src/app/core/models/masters/ms-audit-management/ms-audit-category";

class Store {
    @observable
    private _msAuditCategory: MsAuditCategory[] = [];

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
    individualMsAuditCategory: MsAuditCategorySingle;

    // @observable
    // msAuditCategoryDetails: any;

    searchText: string;

    @observable
    selectedMsAuditCategoryList: MsAuditCategory[] = [];

    @observable
    saveSelected: boolean = false;

    // @observable
    // business_application_select_form_modal: boolean = false;

    @action
    setMsAuditCategory(response: MsAuditCategoryPaginationResponse) {

        this._msAuditCategory = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unsetMsAuditCategory() {
        this._msAuditCategory = [];
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
    setIndividualMsAuditCategory(auditCategory: MsAuditCategorySingle) {
       
        this.individualMsAuditCategory = auditCategory;
        this.individualLoaded = true;
        
    }
    
    @computed
    get individualMsAuditCategoryId(){
        return this.individualMsAuditCategory;
    } 

    @computed
    get msAuditCategorys(): MsAuditCategory[] {

        return this._msAuditCategory.slice();
    }
    @computed
    get msAuditCategory(): MsAuditCategory[] {

        return this._msAuditCategory.slice();
    }

    @action
    getMsAuditCategoryById(id: number): MsAuditCategory {
        return this._msAuditCategory.slice().find(e => e.id == id);
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
    addSelectedMsAuditCategory(issues){
        this.selectedMsAuditCategoryList = issues;
    }

    unsetSelectedMsAuditCategory(){
        this.selectedMsAuditCategoryList = [];
    }
}

export const MsAuditCategoryMasterStore = new Store();