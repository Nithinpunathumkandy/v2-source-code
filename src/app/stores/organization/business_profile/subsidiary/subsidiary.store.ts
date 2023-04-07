import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Subsidiary, SubsidiaryDetails } from 'src/app/core/models/organization/business_profile/subsidiary/subsidiary';
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable //Store Subsidiary List
    private _subsidiaryList: Subsidiary[] = [];

    @observable //Sets whether subsidiary list is stored or not
    loaded: boolean = false;

    $observable //Sets id of which subsidiary is selected
    selected: number = null;

    @observable //Sets details of selected subsidiary
    selectedSubsidiaryDetails: SubsidiaryDetails;

    @observable //Sets whether selected subsidiary is loaded or not
    selected_subsidiary_loaded: boolean = false;

    @observable
    selected_preview_url: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    private _brocureDetails: Image[] = [];

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @action // Sets the subsidiary List
    setSubsidiaryList(subsidiaries: Subsidiary[]) {
        this.loaded = true;
        this._subsidiaryList = subsidiaries;
    }

    @computed // Gets Subsidiary list
    get subsidiaryList(): Subsidiary[] {
        return this._subsidiaryList.slice();
    }
    // @computed
    // get allItems(): Subsidiary[] {
        
    //     return this._subsidiaryList.slice();
    // }

    @action // Sets selected subsidiary id
    setSelected(value:number){
        this.selected = value;
    }

    // Get selected subsidiary id
    get selectedItem():number{
        return this.selected;
    }

    //Not Using Now
    getSubsidiaryById(id: number): Subsidiary {
        return this._subsidiaryList.slice().find(e => e.id == id);
    }

    @computed // Returns Initial Subsidiary Id
    get initialSubsidiaryId():number{
        if(this._subsidiaryList.length > 0)
            return this._subsidiaryList[0].id
    }

    @action //Sets Logo or Brochure details according to type
    setFileDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            // this.preview_url = url;
        }
        else{
            this._brocureDetails.unshift(details);
            // this.brochure_preview_url = url;
        }
    }

    @action // When delete is clicked for logo or brochure
    unsetFileDetails(type: string,token?:string){
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
            var b_pos = this._brocureDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._brocureDetails[b_pos].hasOwnProperty('is_new')){
                    this._brocureDetails.splice(b_pos,1);
                }
                else{
                    this._brocureDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        }
    }

    //Returns File Details by Type
    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
    }

    // Returns Brochures Array
    get getBrochureDetails(): Image[]{
        return this._brocureDetails;
    }

    @action //Clears Brochures Array
    clearBrochureDetails(){
        this._brocureDetails = [];
    }

    @action //Sets Selected Subsidiary Details
    setSelectedSubsidiaryDetails(subsidiaryDetails: SubsidiaryDetails){
        this.selectedSubsidiaryDetails = subsidiaryDetails;
        this.selected_subsidiary_loaded = true;
    }

    //Returns Selected Subsidiary Details
    get getSelectedSubsidiaryDetails(): SubsidiaryDetails{
        return this.selectedSubsidiaryDetails;
    }

    @action //Unsets Selected Subsidiary Details
    unsetSelectedSubsidiaryDetails(){
        this.selectedSubsidiaryDetails = null;
        this.selected_subsidiary_loaded = false;
    }

    setBrochureDetails(details){
        if(this.selectedSubsidiaryDetails)
            this.selectedSubsidiaryDetails.brouchures = details;
    }

    @action //Clear Subsidiary List
    clearSubsidiaryList(){
        this._subsidiaryList = [];
        this.loaded = false;
    }


}

export const SubsidiaryStore = new Store();