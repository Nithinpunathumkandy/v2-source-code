
import { observable, action, computed } from "mobx-angular";

import { AssetMaintenance, AssetMaintenancePaginationResponse, IndividualAssetMaintenance } from 'src/app/core/models/asset-management/asset-register/asset-maintenance';
import { Image } from "src/app/core/models/image.model";


class Store {
    @observable
    private _assetMaintenance: AssetMaintenance[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    private _assetMaintenanceSchedules = [];

    @observable 
    scheduleLoaded:boolean=false;

    @observable
    private _assetMaintenanceShutdowns= [];

    @observable 
    shutdownLoaded:boolean=false;

    @observable
    editFlag: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'assets.created_at';

    @observable
    private _individualMaintenanceDetails: IndividualAssetMaintenance;

    @observable
    individual_maintenance_loaded: boolean = false;

    @observable
    maintenanceId = null;

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

    searchText: string;

    @observable
    maintananceMainTab:boolean = false;

    @observable
    shutdownData=null;

    @observable
    frequencyShutdownData = [];

    @observable
    shutdown_preview_url: string;

    @observable
    private _shutdowndocumentDetails: Image[] = [];

    @observable
    schedule_preview_url: string;

    @observable
    private _scheduledocumentDetails: Image[] = [];

    @observable
    _updateArray :Image[] = [];

    @observable
    singleFileUpload: boolean = false;

    @observable
    _systemFile: Image[] = [];

    
    @observable
    preview_url: string;

   
    @action
    setAssetMaintenance(response: AssetMaintenancePaginationResponse) {


        this._assetMaintenance = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;

    }

    @action
    setAssetMaintenanceSchedules(response) {


        this._assetMaintenanceSchedules = response.data;
        this.scheduleLoaded = true;

    }

    @action
    setAssetMaintenanceShutdowns(response) {


        this._assetMaintenanceShutdowns = response.data;

        this.shutdownLoaded = true;

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
    setMaintenanceId(id: number) {

        this.maintenanceId = id;
    }

    @computed
    get getmaintenanceId() {
        return this.maintenanceId;
    }

  
    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }
    
    @computed
    get assetMaintenance(): AssetMaintenance[] {
        
        return this._assetMaintenance.slice();
    }

    @computed
    get assetMaintenanceSchedules(): AssetMaintenance[] {
        
        return this._assetMaintenanceSchedules.slice();
    }

    @computed
    get assetMaintenanceShutdowns(): AssetMaintenance[] {
        
        return this._assetMaintenanceShutdowns.slice();
    }

    

    unsetAssetMaintenanceDetails() {
    
        this._assetMaintenance = [];
      
        this.loaded = false;
       
    }

    setLastInsertedId(id: number) {
        this.lastInsertedId = id;
    }

    @action
    setIndividualAssetDetails(details: IndividualAssetMaintenance) {
        this.individual_maintenance_loaded = true;
        this._individualMaintenanceDetails = details;
        //this.updateRisk(details);
    }
    @action
    unsetIndiviudalAssetDetails() {
        this._individualMaintenanceDetails = null;
        this.individual_maintenance_loaded = false;
    }


    @computed
    get individualMaintenanceDetails(): IndividualAssetMaintenance {
        return this._individualMaintenanceDetails;
    }

    @action
    setShutdownData(data){
        this.shutdownData=data
    }

    @action
    unsetShutdownData(){
        this.shutdownData= null
    }

    
    @action
    setShutdownDocumentDetails(details: Image, url: string) {
        
            this._shutdowndocumentDetails.push(details);
            this.shutdown_preview_url = url;
        
    }

    @action
    unsetShutdownDocumentDetails(token?:string){
        
            var b_pos = this._shutdowndocumentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._shutdowndocumentDetails[b_pos].hasOwnProperty('is_new')){
                    this._shutdowndocumentDetails.splice(b_pos,1);
                }
                else{
                    this._shutdowndocumentDetails[b_pos]['is_deleted'] = true;
                    this._shutdowndocumentDetails.splice(b_pos,1);
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }

    @action
    clearShutdownDocumentDetails() {
        this._shutdowndocumentDetails = [];
        this.shutdown_preview_url = null;
    }

    @computed
    get shutdownDocDetails(): Image[] {
        return this._shutdowndocumentDetails.slice();
    }



    @action
    setScheduleDocumentDetails(details: Image, url: string) {
        
            this._scheduledocumentDetails.push(details);
            this.schedule_preview_url = url;
        
    }

    @action
    unsetScheduleDocumentDetails(token?:string){
        
            var b_pos = this._scheduledocumentDetails.findIndex(e => e.token == token)
            console.log(b_pos)
            if(b_pos != -1){
                if(this._scheduledocumentDetails[b_pos].hasOwnProperty('is_new')){
                    this._scheduledocumentDetails.splice(b_pos,1);
                }
                else{
                    this._scheduledocumentDetails[b_pos]['is_deleted'] = true;
                    this._scheduledocumentDetails.splice(b_pos,1);
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }

    @action //Sets Support Files
    setSystemFile(details: Image, url: string) {

        if(!this.singleFileUpload){
            this._systemFile.unshift(details);
            this.preview_url = url;
        }else {
            this.clearDocFiles()
            this._systemFile = [details];
            this.preview_url = url;
        }

    }

    @action
    clearScheduleDocumentDetails() {
        this._scheduledocumentDetails = [];
        this.schedule_preview_url = null;
    }
    @action
    setDocumentFile(details) {
     
     this._scheduledocumentDetails=details;
    }

    @action
    setDocumentShutdownFile(details) {
     
     this._shutdowndocumentDetails=details;
     //console.log(this._shutdowndocumentDetails);
    }


    @action
    setFilestoDisplay(files){
        this._scheduledocumentDetails=files;
    }

    

    @action
    setShutDownFilestoDisplay(files){
        this._shutdowndocumentDetails=files;
    }
    @action
    setUpdateFileArray(files:Image){
                // Setting a array to compare when processing the data when sending to backend.
        this._updateArray.unshift(files)
    }
    get getKHFiles(): Image[]{
        return this._scheduledocumentDetails;
    }

    get getShutDownFiles(): Image[]{
        return this._shutdowndocumentDetails;
    }

    @computed
    get scheduleDocDetails(): Image[] {
        return this._scheduledocumentDetails.slice();
    }
    get getSystemFile(): Image[]{
        return this._systemFile;
    }

    get getSystemSutdownFile(): Image[]{
        return this._systemFile;
    }
    @action
    clearDocFiles() {
        this._scheduledocumentDetails = [];
        this._shutdowndocumentDetails =[];
        //console.log(this._scheduledocumentDetails)
    }

    @action
    clearSystemFiles() {
        this._systemFile = [];
    }



  
}

export const AssetMaintenanceStore = new Store();

