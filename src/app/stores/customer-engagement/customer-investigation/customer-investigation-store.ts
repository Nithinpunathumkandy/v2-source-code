import { action, computed, observable } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { CustomerInvestigation, CustomerInvestigationPaginationResponse, IndivitualCustomerInvestigation } from "src/app/core/models/customer-satisfaction/customer-investigation/customer-investigation";


class Store {
    @observable
    private _customerInvestigation: CustomerInvestigation[] = [];

    @observable 
    _indivitualCustomerInvestigation = null;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    customerComplaintId:number = null

    @observable
    orderItem: string = 'customer_complaints.title';

    @observable
    individualLoaded: boolean = false;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image = null;

    @observable
    hideSubMenu: boolean = false;

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setCustomerInvestigation(response: CustomerInvestigationPaginationResponse) {
        

        this._customerInvestigation = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = null;
        this.preview_url = null;
    }
   
    @action
    setDocumentDetails(details: Image,url: string) {
        
            this._documentDetails = details;
            this.preview_url = url;
        
    }

    @action
    unsetDocumentDetails(token?:string){
        
            if (this._documentDetails.hasOwnProperty('is_new')) {
                this._documentDetails = null;
                this.preview_url = null;
            }
            else {
                this._documentDetails['is_deleted'] = true;             
            }   
       
    }
    
    @computed
    get allItems(): CustomerInvestigation[] {
        
        return this._customerInvestigation.slice();
    }

    @computed
    get docDetails(): Image {
        return this._documentDetails;
    }

    @action
    setIndivitualCustomerInvestigation(indivitual: IndivitualCustomerInvestigation) {       
    this._indivitualCustomerInvestigation = indivitual;
    this.individualLoaded = true;
    
    }

    @action
    unsetIndivitualCustomerInvestigation() {       
        this._indivitualCustomerInvestigation = null;
        this.individualLoaded = false;   
    }

    get indivitualCustomerInvestigation(){
    return this._indivitualCustomerInvestigation
    }

    @action
    setSubMenuHide(value:boolean){
        this.hideSubMenu = value
    }

    @action
    unsetCustomerInvestigationList(){
        this._customerInvestigation = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @computed
    get tabHides(){
        return this.hideSubMenu;
    } 

  
}


export const CustomerInvestigationStore = new Store();