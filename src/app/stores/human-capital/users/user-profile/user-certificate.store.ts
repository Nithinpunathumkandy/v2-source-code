import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { Certificate } from 'src/app/core/models/human-capital/users/user-certificate';

class Store {
    
    @observable
    private _userCertificate: Certificate[] = [];

    @observable
    user_certificate_loaded: boolean = false;

    @observable
    private _certificateDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    certificate_preview_available = false;


    @action
    setCertificate(settings: Certificate[]) {

        this._userCertificate = settings;
        this.user_certificate_loaded = true;
    }

    @action
    getCertificateById(id: number): Certificate {
        return this._userCertificate.slice().find(e => e.id == id);
    }

    @computed
    get certificate(): Certificate[] {

        return this._userCertificate;
    }

    get certificateImage(): Image {
        return this._certificateDetails;
    }

    @action
    clearCertificate() {
        this._certificateDetails = null;
    }

    @action
    setImageDetails(details: Image, url: string, type: string) {
       
            this._certificateDetails = details;//for user certificates
            this.preview_url = url;
        
    }

    @action
    unsetImageDetails(type: string, token?: string) {
        
            if (this._certificateDetails.hasOwnProperty('is_new')) {
                this._certificateDetails = null;
                this.preview_url = null;
            }
            else {
                this._certificateDetails['is_deleted'] = true;
               
            }
          
    }




}

export const UserCertificateStore = new Store();