import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { AddUser, Address } from 'src/app/core/models/human-capital/users/add-user';
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _addUserList: AddUser[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentStep: number = 0;

    @observable
    private _imageDetails: Image = null;

    @observable
    editFlag: boolean = false;

    @observable
    preview_url: string;

    @observable
    logo_preview_available = false;

    @action
    setAddUserDetails(response: AddUser[]) {
        this._addUserList = response;
        this.loaded = true;
    }

    @action
    setCurrentStep(current_step: number) {
        this.currentStep = this.currentStep + current_step;
    }



    @computed
    get addUserDetails(): AddUser[] {
        return this._addUserList.slice();
    }


    @action
    setImageDetails(details: Image, url: string) {
        this._imageDetails = details;
        this.preview_url = url;
    }

    @action
    unsetImageDetails() {
        if(this._imageDetails){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
            }
    
        }

    }

    clearImageDetails(){
        this._imageDetails = null;
    }

    clearPreviewDetails(){
        this.preview_url = null;
    }
    

    @action
    setEditFlag() {
        this.editFlag = true;
    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }

    getProductImageDetailsByType(type: string): Image {
        if(type=='logo'){
            return this._imageDetails;
        }

        
    }

    get getProductImageDetails(): Image {
        return this._imageDetails;
    }




}

export const AddUserStore = new Store();