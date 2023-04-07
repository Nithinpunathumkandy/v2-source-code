import { action, computed, observable } from 'mobx';
import { profile } from 'src/app/core/models/my-profile/profile/myprofile-profile.model';
import { Image } from 'src/app/core/models/image.model';

class Store{
    @observable
    private _profile:profile;

    @observable
    private _userId:number;

    @observable
    logo_preview_available = false;

    @observable
    profile_preview_available = false;

    @observable
    loaded:boolean =false;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @computed
    get profile(): profile {
       return this._profile;
    }

    @computed
    get userId() {
       return this._userId;
    }

    @action
    setProfile(response: profile ){
        this._profile = response;
        this._userId = response.id;
        this.loaded = true;
    }

    @action
    setImageDetails(details: Image, url: string) {
            this._imageDetails = details;//for user profile
            this.preview_url = url;
    }

    @action
    unsetImageDetails() {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;    
            }
    }

    noImages(){
        this._imageDetails = null;//for user profile
        this.preview_url = null;
    }
    getProductImageDetailsByType(type: string): Image {
        if(type=='logo'){
            return this._imageDetails;
        }    
    }

    get getProductImageDetails(): Image {
        return this._imageDetails;
    }

    unsetProfile(){
        this._profile = null;
        this._userId = null;
        this.loaded = false;
    }
}

export const MyProfileProfileStore = new Store();