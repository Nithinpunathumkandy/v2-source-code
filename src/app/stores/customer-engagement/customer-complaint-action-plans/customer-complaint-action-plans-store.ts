import { action, computed, observable } from "mobx-angular";
import { CustomerComplaintActionPlan, CustomerComplaintActionPlanPaginationResponse, IndividualCustomerComplaintActionPlan } from "src/app/core/models/customer-satisfaction/customer-complaint-action-plans/customer-complaint-action-plans";
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _customerComplaintActionPlan: CustomerComplaintActionPlan[] = [];

    @observable 
    _indivitualCustomerComplaintActionPlan:IndividualCustomerComplaintActionPlan = null;

    @observable  
    loaded:boolean=false;

    @observable
    hideSubMenu: boolean = false;

    @observable
    customerComplaintId:number = null

    @observable
    correctiveActionId:number = null

    @observable
    update_document_preview_available = false;
 
    @observable
    private _updateDocumentDetails: Image[] = [];

    @observable
    private _imageDetails: Image = null;

    @observable
    selected_preview_url: string;

    @observable
    updatePreview_url: string;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    complaintActionPlanId:number = null

    @observable
    orderItem: string = 'customer_complaint_action_plans.created_at';

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

    @observable
    private _documentDetails: Image[] = [];

    @observable
    preview_url: string;


    @action
    setSubMenuHide(value:boolean){
        this.hideSubMenu = value
    }

    @computed
    get tabHides(){
        return this.hideSubMenu;
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
    setCustomerComplaintActionPlans(response: CustomerComplaintActionPlanPaginationResponse) {
        this._customerComplaintActionPlan = response.data;
        this.currentPage = response.current_page;
        this.last_page = response.last_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @computed
    get allItems(): CustomerComplaintActionPlan[] {
        return this._customerComplaintActionPlan.slice();
    }

    @action
    setIndivitualCustomerComplaintActionPlan(indivitual: IndividualCustomerComplaintActionPlan) {       
    this._indivitualCustomerComplaintActionPlan = indivitual;
    this.individualLoaded = true;
    
    }

    @action
    unsetIndivitualCustomerComplaintActionPlan() {       
        this._indivitualCustomerComplaintActionPlan = null;
        this.individualLoaded = false;   
    }

    @action
    unsetCustomerComplaintActionPlan() {       
        this._customerComplaintActionPlan = null;
        this.loaded = false;   
    }

    @computed
    get indivitualCustomerComplaintActionPlan(){
    return this._indivitualCustomerComplaintActionPlan
    }

    @action
    getCustomerComplaintActionPlanById(id: number): CustomerComplaintActionPlan {
        return this._customerComplaintActionPlan.slice().find(e => e.id == id);
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    setDocumentDetails(details: Image, url: string) {
        // this._documentDetails = details;
        this._documentDetails.push(details);
        this.preview_url = url;
    }
    @action
    unsetDocumentDetails(token?: string) {
        // if (this._documentDetails.hasOwnProperty('is_new')) {
        //     this._documentDetails = [];
        //     this.preview_url = null;
        // }
        // else {
        //     this._documentDetails['is_deleted'] = true;
        // }
        var b_pos = this._documentDetails.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._documentDetails[b_pos].hasOwnProperty('is_new')) {
                this._documentDetails.splice(b_pos, 1);
            }
            else {
                this._documentDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    @action
    clearUpdateDocumentDetails() {
        this._updateDocumentDetails = [];
        this.preview_url = null;
    }

    @action
    setDocumentImageDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            this.preview_url = url;
        }
        else {
            this._updateDocumentDetails.push(details);
            this.preview_url = url;
        }
    }

    @action
    setSelectedImageDetails(imageDetails){    
        this.selected_preview_url = imageDetails;
    }

    @computed
    get docDetails(): Image[] {
        return this._documentDetails;
    }
  
    @computed
    get getUpdateDocumentDetails(): Image[]{
        return this._updateDocumentDetails.slice();
    } 

    @action
    unsetProductImageDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else{
            var b_pos = this._updateDocumentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._updateDocumentDetails[b_pos].hasOwnProperty('is_new')){
                    this._updateDocumentDetails.splice(b_pos,1);
                }
                else{
                    this._updateDocumentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        }  
    }

    @action
    unsetCustomerComplaintActionPlans() {
        this._customerComplaintActionPlan = [];
        this.currentPage = 1;
        this.loaded = false;
    }

}


export const CustomerComplaintActionPlanStore = new Store();