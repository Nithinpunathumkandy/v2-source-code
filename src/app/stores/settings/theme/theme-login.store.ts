import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { ThemeLogin, ThemeLoginImages } from 'src/app/core/models/settings/settings-theme-login';
import { AuthStore } from "../../auth.store";

class Store {
    @observable
    loaded: boolean = false;

    @observable
    logo_preview_available = false;

    @observable
    loginbg_preview_available = false;

    @observable
    clientlogo_preview_available = false;

    @observable
    topcube_preview_available = false;

    @observable
    bottomcube_preview_available = false;

    @observable
    authbg_preview_available = false;

    // @observable
    // preview_url: string;

    @observable
    private _loginbgImageDetails: ThemeLoginImages;

    @observable
    private _clientlogoImageDetails: ThemeLoginImages;

    @observable
    private _topcubeImageDetails: ThemeLoginImages ;

    @observable
    private _bottomcubeImageDetails: ThemeLoginImages ;

    @observable
    private _authbgImageDetails: ThemeLoginImages ;

    @observable
    private _loginDetails;

    @observable
    private _loginDetailsById:ThemeLogin;

    @action
    setImageDetails(details, category, id?) {
        switch (category) {
            case 'login-logo':
                this._clientlogoImageDetails = details;
                break;
            case 'top-cube':
                this._topcubeImageDetails = details;
                break
            case 'bottom-cube':
                this._bottomcubeImageDetails = details;
                break
            case 'login-bg':
                this._loginbgImageDetails = details;
                break
            case 'two-factor-bg':
                this._authbgImageDetails = details;
                break
        }
    }

    @action
    unsetFileDetails(category, editFlag: boolean) {
            switch (category) {
                case 'login-logo':
                    if (this._clientlogoImageDetails.hasOwnProperty('is_new')) {
                        this._clientlogoImageDetails = null;
                    }
                    else {
                        this._clientlogoImageDetails['is_deleted'] = true;
                    }
                    break;
                case 'top-cube':

                    if (this._topcubeImageDetails.hasOwnProperty('is_new')) {
                        this._topcubeImageDetails = null;
                    }
                    else {
                        this._topcubeImageDetails['is_deleted'] = true;
                    }
                    break
                case 'bottom-cube':

                    if (this._bottomcubeImageDetails.hasOwnProperty('is_new')) {
                        this._bottomcubeImageDetails = null;
                    }
                    else {
                        this._bottomcubeImageDetails['is_deleted'] = true;
                    }
                    break
                case 'login-bg':

                    if (this._loginbgImageDetails.hasOwnProperty('is_new')) {
                        this._loginbgImageDetails = null;
                    }
                    else {
                        this._loginbgImageDetails['is_deleted'] = true;
                    }
                    break
                case 'two-factor-bg':

                    if (this._authbgImageDetails.hasOwnProperty('is_new')) {
                        this._authbgImageDetails = null;
                    }
                    else {
                        this._authbgImageDetails['is_deleted'] = true;
                    }
                    break
            }
        
    }

    removeDeletedElement(){
        
        if (ThemeLoginSettingStore._loginbgImageDetails?.is_deleted) {
          ThemeLoginSettingStore._loginbgImageDetails = null;
          return this._loginbgImageDetails;
        }
        if (ThemeLoginSettingStore._clientlogoImageDetails?.is_deleted) {
            ThemeLoginSettingStore._clientlogoImageDetails = null;
            return this._clientlogoImageDetails;
        }
        if (ThemeLoginSettingStore._bottomcubeImageDetails?.is_deleted) {
            ThemeLoginSettingStore._bottomcubeImageDetails = null;
            return this._bottomcubeImageDetails;
        }
        if (ThemeLoginSettingStore._topcubeImageDetails?.is_deleted) {
            ThemeLoginSettingStore._topcubeImageDetails = null;
            return this._topcubeImageDetails;
        }
        if (ThemeLoginSettingStore._authbgImageDetails?.is_deleted) {
            ThemeLoginSettingStore._authbgImageDetails = null;
            return this._authbgImageDetails;
        }
      }

    setThemeLoginDetails(response) {
        this._loginDetails = response.data;
    }

    setThemeLoginDetailsById(response) {
        this._loginDetailsById = response;
    }

    // images get start
    @computed
    get clientlogoImageDetails() {
        return this._clientlogoImageDetails;
    }

    @computed
    get topcubeImageDetails() {
        return this._topcubeImageDetails;
    }

    @computed
    get bottomcubeImageDetails() {
        return this._bottomcubeImageDetails;
    }

    @computed
    get loginbgImageDetails() {
        return this._loginbgImageDetails;
    }

    @computed
    get authbgImageDetails() {
        return this._authbgImageDetails;
    }
    // end

    @computed
    get themeLoginDetails() {
        return this._loginDetails;
    }

    @computed
    get themeLoginDetailsById() {
        return this._loginDetailsById;
    }
}
export const ThemeLoginSettingStore = new Store();