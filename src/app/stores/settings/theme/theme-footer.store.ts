import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";

class Store{
    @observable
    loaded: boolean = false;

    @observable
    logo_preview_available = false;

    @observable
    private _imageDetails: Image = null;

    @observable
    private _brocureDetails: Image = null;

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

    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
        else
            return this._brocureDetails;
    }

    @action
    unsetFileDetails(type: string){
       
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                // this.preview_url = null;
            }       
    }

}
export const ThemeFooterSettingsStore = new Store();