
import { Image } from "src/app/core/models/image.model";
import { observable, action, computed } from "mobx-angular";
import { ComplianceRegister, ComplianceRegisterDetails, ComplianceRegisterPaginationResponse, StatusHistory } from "src/app/core/models/compliance-management/compliance-register/compliance-register";
import { ComplianceStatusPaginationResponse } from "src/app/core/models/masters/compliance-management/compliance-status";



class Store {
    @observable
    private _complianceRegister: ComplianceRegister[] = [];

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'compliance_register_title.created_at';

    @observable
    individualLoaded: boolean = false;

    @observable
     complianceStatusHistory: ComplianceRegisterDetails;

    @observable
    complianceRegisterId:number = null

    @observable
    editFlag: boolean = false;

    @observable
    individualComplianceRegister: ComplianceRegisterDetails;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    preview_url: string;

    @observable
    document_preview_available: boolean = false;

    @observable
    private _documentDetails: Image = null;

    @observable
    individualCAItem: ComplianceRegister;

    @observable
    selectedNeedsExpectations: any[] = [];

    @observable
    complianceRegisterDetailList :ComplianceRegisterDetails

    @observable
    complianceRegisterDetailListLoaded:  boolean = false;

    @observable
    complianceRegisterHistoryLoaded:  boolean = false;

    @observable
    individualIncidentCorrectiveAction: ComplianceRegister;

    @observable
    selectedIncidentId: number

    @observable
    searchText: string;

    @observable
    compliance_select_form_modal:boolean=false;

    @observable
    saveSelected: boolean = false;

    @observable
    selectedCompliance:ComplianceRegister[]=[]

    addSelectedCompliances(issues){
        this.selectedCompliance = issues;
    }

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
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
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setComplianceRegister(response: ComplianceRegisterPaginationResponse) {
        this._complianceRegister = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }


    @action
    setAllComplianceRegister(complianceRegister: ComplianceRegister[]) {
       
        this._complianceRegister = complianceRegister;
        this.loaded = true;
        
    }

    @action
    setIndividualComplianceRegisterItem(complianceRegister: ComplianceRegisterDetails) {
        // console.log("compliance",complianceRegister)
       
        this.individualComplianceRegister = complianceRegister;
        this.individualLoaded = true;
        
    }
    


    @action
    setSelectedIincidentId(id: number){
        this.selectedIncidentId = id;
    }

    
    @computed
    get allItems(): ComplianceRegister[] {
        
        return this._complianceRegister.slice();
    }

    @computed
    get docDetails(): Image {
        return this._documentDetails;
    }

   

    @computed
    get selectedId(): number{
        return this.selectedIncidentId;
    }
   
    @computed
    get statusHistory(){
        return this.complianceStatusHistory
    }

    @action
    getComplianceRegisterById(id: number): ComplianceRegister {
        return this._complianceRegister.slice().find(e => e.id == id);
    }


    get ComplianceRegisterDetailsList(): ComplianceRegisterDetails{
        return this.complianceRegisterDetailList
    }


    @action
    setComplianceDetails(items : ComplianceRegisterDetails){
        // console.log("items",items)
        this.complianceRegisterDetailList = items
        this.complianceRegisterDetailListLoaded = true;
    }

    @action
    setStatusHistory(items){
        this.complianceStatusHistory = items.data
        this.complianceRegisterHistoryLoaded = true;
    }
    @action
    unsetComplianceRegisterDetails(){
        this.complianceRegisterDetailList = null;
        this.complianceRegisterDetailListLoaded = false;
        this.complianceRegisterHistoryLoaded = false;
        this.complianceStatusHistory = null;
    }

    @action
    unsetComplianceRegisterList(){
        this._complianceRegister = [];
        this.loaded = false;
        this.currentPage = 1;
    }
  
}


export const ComplianceRegisterStore = new Store();

