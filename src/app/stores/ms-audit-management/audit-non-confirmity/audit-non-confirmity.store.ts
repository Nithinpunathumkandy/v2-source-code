import {observable,action,computed } from "mobx-angular";
import { AuditNonConfirmity, AuditNonConfirmityResponse } from "src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity";
class Store {
    @observable
    private _nonConfirmities : AuditNonConfirmity[] = [];

    @observable
    private _individualAuditNonConfirmityDetails: AuditNonConfirmity;

    @observable
    brudcrubDisable:boolean=true;

    @observable
    individualLoaded: boolean = false;

    @observable
    nonConfirmityRedirect: boolean = false;

    @observable
    path: string = './';

    @observable
    loaded: boolean = false;

    @observable
    editFlag: boolean = false;
    
    @observable
    currentPage: number = 1;
    
    @observable
    itemsPerPage: number = 15;
    
    @observable
    totalItems: number = null;
    
    @observable
    from: number = null;

    @observable
    rcaDataLength: number = null;

    @observable
    msAuditNonConfirmityId:number;
    
    @observable
    orderItem: string = '';
    
    @observable
    last_page: number = null;
    
    @observable
    orderBy: 'asc' | 'desc' = 'desc';
    
  searchText: string;

  @observable
  selectedMstpyes = [];

  @observable
  selectedDocIds = [];

 @action
setCurrentPage(current_page: number) {
    this.currentPage = current_page;
}

@action
checkSelectedStatuss(data,type) {
    var pos = null;
    if(this.selectedDocIds.length > 0){
       let kpos =  this.selectedDocIds.findIndex(e=> e.id == data.id && e.ms_type_organization_id == type.ms_type_organization_id)
       if(kpos != -1)
       return true;
       else return false; 
    }
  
  }
  
  
  
  @action
    getOrganisationMsTypeData(data,type,loopType?){
      let orgData 
     
      if(this.selectedMstpyes.length > 0){
        orgData = {
          ms_type_organization_id : type.ms_type_organization_id,
          document_id : type.id,
          document_version_content_ids : []
        }

        let pos = this.selectedMstpyes.findIndex(e=>e.ms_type_organization_id == type.ms_type_organization_id)
           if(pos != -1){
            let kpos = this.selectedMstpyes[pos].document_version_content_ids.findIndex(e=>e == data.id )
            if(kpos != -1 ){
              this.selectedMstpyes[pos].document_version_content_ids.splice(kpos,1);
              this.selectedDocIds.splice(kpos,1)
              // this.selectedMstpyes[pos].document_version_content_ids.splice(kpos,1)
              // if(this.selectedMstpyes[pos].document_version_content_ids){
              //   this.selectedMstpyes.splice(pos,1)
              // }
            }else {
              let checkData = {
                id : data.id,
                ms_type_organization_id : type.ms_type_organization_id
              }
              this.selectedDocIds.push(checkData)
              this.selectedMstpyes[pos].document_version_content_ids.push(data.id)
            }
           }else{
            let checkData = {
              id : data.id,
              ms_type_organization_id : type.ms_type_organization_id
            }
            this.selectedDocIds.push(checkData)
             orgData.document_version_content_ids.push(data.id)
             this.selectedMstpyes.push(orgData)
           }
         
       }else {
        orgData = {
          ms_type_organization_id : type.ms_type_organization_id,
          document_id : type.id,
          document_version_content_ids : []
         }
         let checkData = {
          id : data.id,
          ms_type_organization_id : type.ms_type_organization_id
        }
        this.selectedDocIds.push(checkData)
         orgData.document_version_content_ids.push(data.id)
         this.selectedMstpyes.push(orgData)
       }
    }

    @action
    unSetData(){
        this.selectedDocIds = [];
        this.selectedMstpyes = [];
    }

@action
setMsAuditNonConfirmity(response : AuditNonConfirmityResponse){
    this._nonConfirmities = response.data;
    this.currentPage = response.current_page;
    this.itemsPerPage = response.per_page;
    this.totalItems = response.total;
    this.from = response.from;
    this.loaded = true;
}


@computed
get msAuditNonConfirmity() {
    return this._nonConfirmities
}

@action
unsetMsAuditNonConfirmity(){
  this._nonConfirmities = null
  this.currentPage = 1
  this.itemsPerPage = 15
  this.totalItems = null
  this.from = null
  this.loaded = false;
}

    @action
    setmsAuditNonConfirmityId(id: number) {
        this.msAuditNonConfirmityId = id;
    }

    @action
    setPath( url: string) {
        this.path = url;
    }

    //*Detials
    @action
    setIndividualMsAuditNonConfirmityDetails(details: AuditNonConfirmity) {
        this.individualLoaded = true;
        this._individualAuditNonConfirmityDetails = details;
    }

    @action
    unsetIndividualMsAuditNonConfirmityDetails() {
        this.individualLoaded = false;
        this._individualAuditNonConfirmityDetails = null;
    }
    
    @computed
    get individualMsAuditNonConfirmityDetails(): AuditNonConfirmity {
        return this._individualAuditNonConfirmityDetails;
    }

    //**Detials
}
export const AuditNonConfirmityStore = new Store()