import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { MsType, MsTypePaginationResponse, MsTypeDetails, AllMsTypeDetails } from 'src/app/core/models/organization/business_profile/ms-type/ms-type';
import { MsTypeVersion, AvailableMsTypeVersions } from 'src/app/core/models/masters/organization/ms-type-version';
import { Image } from "src/app/core/models/image.model";

class Store {

    @observable
    private _msTypeList: MsType[] = [];

    @observable
    private _msTypeVersionList: AvailableMsTypeVersions[] = [];

    @observable
    private _allMsTypes: AllMsTypeDetails[] = [];

    @observable
    loaded: boolean = false;

    @observable
    selectedMsTypeDetails: MsTypeDetails;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    orderBy: 'asc' | 'desc' = null;

    @observable
    hideSubMenu: boolean = false;

    // @observable
    // private msType: MsType = null;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable // String to perform Search on
    searchText: string = ''; 

    @action
    setMsTypeDetails(response: MsTypePaginationResponse) {
        this._msTypeList = response.data;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
        this.loaded = true;
    }

    @action
    setMsTypeVersionList(res:AvailableMsTypeVersions[]){
        this._msTypeVersionList = res;
    }

    @action
    setAllMsTypes(allMsTypes: AllMsTypeDetails[]){
        this.loaded = true;
        this._allMsTypes = allMsTypes;
    }

    @computed
    get allMsTypes():AllMsTypeDetails[]{
        return this._allMsTypes.slice();
    }

    defaultMsTypeVersion(id: number):string{
        var defaultVersion = '';
        for(let i of this._allMsTypes){
            for(let j of i.ms_types){
                let pos = j.ms_type_version.findIndex(e => e.ms_type_version_details.ms_type_id == id);
                if(pos != -1){
                    defaultVersion = j.ms_type_version[pos].ms_type_version_details.title;
                    break;
                }
            }
        }
        return defaultVersion;
    }

    @action
    unsetSpecificVersionList(){
        this._msTypeVersionList = [];
    }

    @computed
    get msTypeVersionList(): AvailableMsTypeVersions[]{
        return this._msTypeVersionList.slice();
    }

    // @action
    // setOrderBy(order_by: 'asc' | 'desc') {
    //     this.orderBy = order_by;
    // }

    @computed
    get msTypeDetails(): MsType[] {
        return this._msTypeList.slice();
    }

    getMsTypeDetailsById(id: number): MsType {
        return this._msTypeList.slice().find(e => e.id == id);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    // @action
    // setSpecificMsType(mtype: MsType){
    //     this.msType = mtype;
    // }

    // @action
    // unsestSpecificMsType(){
    //     this.msType = null;
    // }

    // getSpecificMsType(){
    //     if(this.msType)
    //         return this.msType;
    // }

    @action
    setSelectedMsTyeDetails(msTypeDetails: MsTypeDetails){
        this.selectedMsTypeDetails = msTypeDetails;
    }

    get getSelectedMsTypeDetails(): MsTypeDetails{
        return this.selectedMsTypeDetails;
    }

    @action
    unsetSelectedMsTypeDetails(){
        this.selectedMsTypeDetails = null;
    }

    @action
    unsetAllData(){
        this.loaded = false;
        this._allMsTypes = [];
        this.currentPage = 1;
    }

    @action
    setSubMenuHide(value:boolean){
        this.hideSubMenu = value
    }

    @computed
    get tabHides(){
        return this.hideSubMenu;
    } 

    @observable
    private _documentDetails: Image = null;

    @observable
    private _certificateDetails: Image[] = [];

    @action // Set Thumbnail Details
    setFileDetails(details:Image, url: string, type: string){
        if(type == 'document'){
            this._documentDetails = details;
            // this.preview_url = url;
        }
        else{
            this._certificateDetails.push(details);
            // this.brochure_preview_url = url;
        }
    }

    @action // Removes Images
    unsetFileDetails(type:string,token?:string){
        if(type == 'document'){
            if(this._documentDetails.hasOwnProperty('is_new')){ // If Newly uploaded remove
                this._documentDetails = null;
                // this.preview_url = null;
            }
            else{ // Set is_deleted flag
                this._documentDetails['is_deleted'] = true; 
                // this.preview_url = null;
            }
        }
        else{
            var b_pos = this._certificateDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._certificateDetails[b_pos].hasOwnProperty('is_new')){
                    this._certificateDetails.splice(b_pos,1);
                }
                else{
                    this._certificateDetails[b_pos]['is_deleted'] = true;
                }
            }
        }
    }

    getFileDetailsByType(type: string): Image{
        if(type == 'document')
            return this._documentDetails;
    }

        // Returns Brochure Details
        get docDetails(){
            return this._documentDetails
        }
    

     // Returns Brochure Details
     get getBrochureDetails(): Image[]{
        return this._certificateDetails;
    }

    @action // Clear Brochure Details
    clearCertificateDetails(){
        this._certificateDetails = [];
    }

    @action // Clear Brochure Details
    clearDocumentDetails(){
        this._documentDetails = null;
    }


    
}

export const MsTypeStore = new Store();