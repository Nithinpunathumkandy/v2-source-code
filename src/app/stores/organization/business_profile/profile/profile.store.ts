import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ProfileDetails, Profile } from 'src/app/core/models/organization/business_profile/profile/profile';
import { Image } from "src/app/core/models/image.model";

class Store {
    // @observable
    // private _profileDetails: ProfileDetails[] = [];

    @observable
    loaded: boolean = false;

    @observable
    private _imageDetails: Image = null;

    @observable
    private _organizationProfile: Profile;

    @observable
    preview_url: string;

    @observable
    mision_more: boolean = false;

    @observable
    vision_more: boolean = false;

    @observable
    description_more: boolean = false;

    @observable
    ceo_message_more: boolean = false;

    @observable
    values_more: boolean = false;

    // @observable
    // logo_preview_available = false;

    // @observable
    // brochure_preview_available = false;

    @observable
    private _brocureDetails: Image[] = [];

    // @observable
    // brochure_preview_url: string;

    // @action
    // setProfileDetails(profile: ProfileDetails[]) {
    //     this.loaded = true;
    //     this._profileDetails = profile;
    // }

    // @computed
    // get profileDetails(): ProfileDetails[] {
    //     return this._profileDetails.slice();
    // }

    @computed
    get organizationId():number{
        if(this._organizationProfile)
            return this._organizationProfile.id
    }

    // @computed
    // get organizationLogo():string{
    //     if(this._profileDetails.length > 0)
    //         return this._profileDetails[0].image_url
    // }

    @action
    setFileDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{
            this._brocureDetails.push(details);
            // this.brochure_preview_url = url;
        }
    }

    @action
    unsetFileDetails(type: string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
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
        }
    }

    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
    }

    get getBrochureDetails(): Image[]{
        return this._brocureDetails;
    }

    @action
    clearBrochureDetails(){
        this._brocureDetails = [];
    }
    
    @action
    setOrganizationProfile(orgProfile: Profile){
        this.loaded = true;
        this._organizationProfile = orgProfile;
    }

    @action
    unsetOrganizationProfile(){
        this.loaded = false;
        this._organizationProfile = null;
    }

    get organizationProfile():Profile{
        return this._organizationProfile;
    }
    
}

export const ProfileStore = new Store();