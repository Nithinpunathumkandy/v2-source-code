import { observable, action, computed } from "mobx-angular";
import { MsAuditNonConfirmities, MsAuditNonConfirmitiesPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit-non-confirmities/ms-audit-non-confirmities";

class Store{

    @observable
    private _MsAuditNonConfirmities: MsAuditNonConfirmities[] = [];

    @observable
    private _individualMsAuditNonConfirmitiesDetails: MsAuditNonConfirmities;

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

    @observable
    orderItem: string = '';

    @observable
    last_page: number = null;

    

    @observable
    editFlag: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    individualLoaded: boolean = false;

    searchText: string;

    @observable
    MsAuditNonConfirmitiesId: number = null;

    @observable
    path: string = '../';
    

    // form modal
    @observable
    MsAuditNonConfirmitiessformModal:boolean=false;
    // **form modal

    @action
    setPath( url: string) {
        this.path = url;
    }
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setMsAuditNonConfirmities(response: MsAuditNonConfirmitiesPaginationResponse) {
        console.log(response);
        this._MsAuditNonConfirmities = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    unSetMsAuditNonConfirmities(){
        this.loaded = false;
        this.from = null;
        this.totalItems = null;
        this.currentPage = null;
        this._MsAuditNonConfirmities = [];
        this.itemsPerPage = null;
        this.orderItem='';
    }

    @computed
    get allItems(): MsAuditNonConfirmities[] {
        return this._MsAuditNonConfirmities.slice();
    }

    @action
    setMsAuditNonConfirmitiesId(id: number) {
        this.MsAuditNonConfirmitiesId = id;
    }

    // @computed
    // get selectedId(): number{
    //     return this.MsAuditNonConfirmitiesId;
    // }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    //*Detials
    @action
    setIndividualMsAuditNonConfirmitiesDetails(details: MsAuditNonConfirmities) {
        this.individualLoaded = true;
        this._individualMsAuditNonConfirmitiesDetails = details;
    }

    @action
    unsetIndividualMsAuditNonConfirmitiesDetails() {
        this.individualLoaded = false;
        this._individualMsAuditNonConfirmitiesDetails = null;
    }
    
    @computed
    get individualMsAuditNonConfirmitiesDetails(): MsAuditNonConfirmities {
        return this._individualMsAuditNonConfirmitiesDetails;
    }

    //**Detials

    
    // for mapping

    @observable
    select_mapping_form_modal: boolean = false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedItmesForMapping:MsAuditNonConfirmities[]=[];

    addSelecteditems(items){
        this.selectedItmesForMapping = items;
    }

    // **for mapping

}
export const MsAuditNonConfirmitiesStore = new Store();