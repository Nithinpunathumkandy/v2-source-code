import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Branch, BranchDetails } from 'src/app/core/models/organization/business_profile/branches/branches';
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _branchesList: Branch[] = [];

    // @observable
    // private _branchDetails: BranchDetails;

    @observable
    loaded: boolean = false;

    $observable
    selected: number = null;

    @observable
    logo_preview_available = false;

    // @observable
    // selected_preview_url: string;

    @observable
    selectedBranchDetails: BranchDetails;

    @observable
    selectedBranchDetailsLoaded : boolean = false;

    @observable
    private _imageDetails: Image = null;

    // @observable
    // preview_url: string;

    @observable
    private _brocureDetails: Image = null;

    // @observable
    // brochure_preview_url: string;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @action
    setBranchList(branches: Branch[]) {
        this.loaded = true;
        this._branchesList = branches;
    }

    @action
    unsetBranchList() {
        this.loaded = false;
        this._branchesList = [];
    }

    @computed
    get branchDetails(): Branch[] {
        return this._branchesList.slice();
    }

    @action
    setSelected(value:number){
        this.selected = value;
    }

    getBranchById(id: number): Branch {
        return this._branchesList.slice().find(e => e.id == id);
    }

    @computed
    get initialBranchId():number{
        return this._branchesList[0].id
    }

    get selectedItem():number{
        return this.selected;
    }

    @action
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

    @action
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

    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
        else
            return this._brocureDetails;
    }

    @action
    setSelectedBranchDetails(branchDetails: BranchDetails){
        this.selectedBranchDetailsLoaded = true;
        this.selectedBranchDetails = branchDetails;
    }

    @action
    unsetSelectedBranchDetails(){
        this.selectedBranchDetailsLoaded = false;
        this.selectedBranchDetails = null;
    }

    get getSelectedBranchDetails(): BranchDetails{
        return this.selectedBranchDetails;
    }

    // @action
    // setSelectedFileDetails(imageDetails,type){
    //     if(type == 'logo')
    //         this.selected_preview_url = imageDetails;
    // }

    // getSelectedFileDetails(type):string {
    //     if(type == 'logo')
    //         return this.selected_preview_url;
    // }

    @action //Clear branch list
    clearBranchList(){
        this._branchesList = [];
        this.loaded = false;
    }
    

}

export const BranchesStore = new Store();