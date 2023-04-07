import { action, computed, observable } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { CustomerComplaint, CustomerComplaintPaginationResponse, IndividualCustomerComplaint } from "src/app/core/models/customer-satisfaction/customer-complaint/customer-complaint";

class Store {
    @observable
    private _customerComplaint: CustomerComplaint[] = [];

    @observable 
    _indivitualCustomerComplaint = null;

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    customerComplaintId:number = null

    @observable
    orderItem: string = 'customer_complaints.created_at';

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
    preview_url: string;

    @observable
    private _documentDetails: Image = null;

    @observable
    selectedCustomerComplaintId: number = null

    @observable
    projects=[];
    
    @observable
    locations=[];

    @observable
    products=[];

    @observable
    controls=[];

    @observable
    customers=[];

    @observable
    objectives=[];

    @observable
    currentDate=new Date();
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setCustomerComplaint(response: CustomerComplaintPaginationResponse) {
        

        this._customerComplaint = response.data;
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
    get allItems(): CustomerComplaint[] {
        
        return this._customerComplaint.slice();
    }

    @computed
    get docDetails(): Image {
        return this._documentDetails;
    }

    @action
    setIndivitualCustomerComplaint(indivitual: IndividualCustomerComplaint) {       
    this._indivitualCustomerComplaint = indivitual;
    this.individualLoaded = true;
    
    }

    @action
    unsetIndivitualCustomerComplaint() {       
        this._indivitualCustomerComplaint = null;
        this.individualLoaded = false;   
    }

    get indivitualCustomerComplaint(){
    return this._indivitualCustomerComplaint
    }

    @action
    unsetCustomerComplaints(){
        this._customerComplaint = [];
        this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setSelectedCustomerComplaintId(id: number){
        this.selectedCustomerComplaintId = id;
    }

    @computed
    get selectedId(): number{
        return this.selectedCustomerComplaintId;
    }

    @action
    setCustomerComplaintId(id: number) {
        this.customerComplaintId = id;

    }
  
}


export const CustomerComplaintStore = new Store();