
import { action, computed, observable } from 'mobx';
import { Image } from "src/app/core/models/image.model";

class Store{

    @observable
    logo_preview_available = false;

    @observable
    certificate_preview_available = false;
    
    @observable
    user_certificate_loaded: boolean = false;

    @observable
    private _certificateDetails = null;

    @observable
    preview_url: string;

    @action
    clearCertificate() {
        this._certificateDetails = null;
    }

    @action
    setCertificateImageDetails(details, url: string, type: string) {
       
            this._certificateDetails = details;//for user certificates
            this.preview_url = url;
        
    }

    @action
    unsetCertificateImageDetails(type: string, token?: string) {
        
            if (this._certificateDetails.hasOwnProperty('is_new')) {
                this._certificateDetails = null;
                this.preview_url = null;
            }
            else {
                this._certificateDetails['is_deleted'] = true;             
            }        
    }

    get certificateImage() {
        return this._certificateDetails;
    }


}

export const ProfileCertificateStore = new Store();