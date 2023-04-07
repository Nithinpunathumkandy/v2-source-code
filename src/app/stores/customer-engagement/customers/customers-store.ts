import { action, computed, observable } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { Customers, CustomersPaginationResponse, IndivitualCustomers, CustomerComplaints, CustomerFeedbacks, CustomerFeedbacksResponse, CustomerComplaintsResponse } from "src/app/core/models/customer-satisfaction/customers/customers";


class Store {
    @observable
    private _customers: Customers[] = [];

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;
    
    @observable 
    _indivitualCustomers = null;

    @observable
    customersId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    customerComplaintId:number = null

    @observable
    orderItem: string = 'customers.created_at';

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
    lastInsertedCustomers: number = null;
    searchText: string;

    @observable
    preview_url: string;

    @observable
    logo_preview_available = false;

    @observable
    private _brocureDetails: Image = null;

    @observable
    private _imageDetails: Image = null;


    @observable
    private _documentDetails: Image = null;

    @observable
    hideSubMenu: boolean = false;

    @observable
    private _customerComplaints: CustomerComplaints[] = [];

    @observable
    private _customerFeedbacks: CustomerFeedbacks[] = [];

    @observable
    selectedCustomerId: number = null

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setCustomers(response: CustomersPaginationResponse) {
        this._customers = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @action
    setIndivitualCustomers(indivitual: IndivitualCustomers) {       
    this._indivitualCustomers = indivitual;
    this.individualLoaded = true;
    
    }
    @action
    unsetIndivitualCustomers() {       
        this._indivitualCustomers = null;
        this.individualLoaded = false;   
    }

    @action
    setCustomerComplaints(response: CustomerComplaintsResponse) {
        this._customerComplaints = response.data;
    }

    @action
    setCustomerFeedbacks(response: CustomerFeedbacksResponse) {
        this._customerFeedbacks = response.data;
    }

    @computed
    get indivitualCustomers(){
    return this._indivitualCustomers
    }

    @computed
    get CustomerComplaints():CustomerComplaints[]{
        return this._customerComplaints.slice();
    }

    @computed
    get CustomerFeedbacks():CustomerFeedbacks[]{
        return this._customerFeedbacks.slice();
    }


    @action
    getCustomerById(id: number): IndivitualCustomers {
        return this._indivitualCustomers.slice().find(e => e.id == id);
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

    @action
    updateCustomers(Customers: Customers) {
        const customers: Customers[] = this._customers.slice();
        const index: number = customers.findIndex(e => e.id == Customers.id);
        if (index != -1) {
            Customers[index] = Customers;
            this._customers = customers;
        }
    }
    
    @computed
    get customers(): Customers[] {
        
        return this._customers.slice();
    }

    @action // Set File Details
    setFileDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            // this.preview_url = url;
        }
        else{
            this._brocureDetails = details;
            // this.brochure_preview_url = url;
        }
    }

    @action // Unset File Details
    unsetFileDetails(type: string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }
        }
        else{
            this._brocureDetails = null;
            // this.brochure_preview_url = null;
        }
    }
    
    @action
    clearFileDetails(type: string) {
        if(type == 'logo')
        this._imageDetails = null;
        else
        this._brocureDetails = null;
        
    }

    // Return File Details By Type
    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
        else
            return this._brocureDetails;
    }    

    @action
    getCustomersById(id: number): Customers {
        return this._customers.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedcustomers(customersId: number){
        this.lastInsertedCustomers = customersId;
    }

    get lastInsertedcustomers():number{
        if(this.lastInsertedCustomers) 
            return this.lastInsertedCustomers;
        else 
            return null;
    }

    @action
    setSelectedCustomerId(id: number){
        this.selectedCustomerId = id;
    }

    @computed
    get selectedId(): number{
        return this.selectedCustomerId;
    }

    @action
    unsetCustomersList(){
        this._customers = [];
        this.currentPage = 1;
        this.loaded = false;
    }

}

export const CustomersStore = new Store();