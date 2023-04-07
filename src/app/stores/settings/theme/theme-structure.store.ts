import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { ThemeStructure, ThemeStructureImages } from "src/app/core/models/settings/settings-theme-structure.model";

class Store{
    @observable
    loaded: boolean = false;

    @observable
    logo_preview_available = false;

    @observable
    themeStructureObject = {
        'loader': null,
        'fav_icon': null,
        'discussion_icon': null,
        'empty_screen': null,
        'permission': null,
        'not_found': null,
        'error': null,
        'empty_pi_chart': null,
        'empty_bar_chart': null,
        'header_logo':null
    }

    // preview
    @observable
    loader_preview_available = false;

    @observable
    favicon_preview_available = false;

    @observable
    headerlogo_preview_available = false;

    @observable
    discussionicon_preview_available = false;

    @observable
    emptyscreen_preview_available = false;

    @observable
    fournotthree_preview_available = false;

    @observable
    fournotfour_preview_available = false;

    @observable
    fivehundred_preview_available = false;

    @observable
    emptypichart_preview_available = false;

    @observable
    emptybarchart_preview_available = false;

    // image Details
    @observable
    private _loaderImageDetails: ThemeStructureImages;

    @observable
    private _faviconImageDetails: ThemeStructureImages;

    @observable
    private _headerlogoImageDetails: ThemeStructureImages ;

    @observable
    private _discussioniconImageDetails: ThemeStructureImages ;

    @observable
    private _emptyscreenImageDetails: ThemeStructureImages ;

    @observable
    private _fournotfourImageDetails: ThemeStructureImages;

    @observable
    private _fournotthreeImageDetails: ThemeStructureImages;

    @observable
    private _fivehundredImageDetails: ThemeStructureImages ;

    @observable
    private _emptypichartImageDetails: ThemeStructureImages ;

    @observable
    private _emptybarchartImageDetails: ThemeStructureImages ;

    // end

    @observable
    private _imageDetails: Image = null;

    @observable
    private _brocureDetails: Image = null;

    @observable
    private _structureDetails;

    @observable
    private _structureDetailsById:ThemeStructure;

    @action
    setImageDetails(details, category, id?) {
        switch (category) {
            case 'discussion-icon':
                this._discussioniconImageDetails = details;
                break;
            case 'empty-bar-chart':
                this._emptybarchartImageDetails = details;
                break
            case 'empty-pi-chart':
                this._emptypichartImageDetails = details;
                break
            case 'empty-screen':
                this._emptyscreenImageDetails = details;
                break
            case 'fav-icon':
                this._faviconImageDetails = details;
                break
            case '500':
                this._fivehundredImageDetails = details;
                break;
            case '404':
                this._fournotfourImageDetails = details;
                break
            case '403':
                this._fournotthreeImageDetails = details;
                break
            case 'header-logo':
                this._headerlogoImageDetails = details;
                break
            case 'loader':
                this._loaderImageDetails = details;
                break
        }
    }

    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
        else
            return this._brocureDetails;
    }

    @action
    unsetFileDetails(category, editFlag: boolean) {
        switch (category) {
            case 'discussion-icon':
                if (this._discussioniconImageDetails.hasOwnProperty('is_new')) {
                    this._discussioniconImageDetails = null;
                }
                else {
                    this._discussioniconImageDetails['is_deleted'] = true;
                }
                break;
            case 'empty-bar-chart':

                if (this._emptybarchartImageDetails.hasOwnProperty('is_new')) {
                    this._emptybarchartImageDetails = null;
                }
                else {
                    this._emptybarchartImageDetails['is_deleted'] = true;
                }
                break
            case 'empty-pi-chart':

                if (this._emptypichartImageDetails.hasOwnProperty('is_new')) {
                    this._emptypichartImageDetails = null;
                }
                else {
                    this._emptypichartImageDetails['is_deleted'] = true;
                }
                break
            case 'empty-screen':

                if (this._emptyscreenImageDetails.hasOwnProperty('is_new')) {
                    this._emptyscreenImageDetails = null;
                }
                else {
                    this._emptyscreenImageDetails['is_deleted'] = true;
                }
                break
            case 'fav-icon':

                if (this._faviconImageDetails.hasOwnProperty('is_new')) {
                    this._faviconImageDetails = null;
                }
                else {
                    this._faviconImageDetails['is_deleted'] = true;
                }
                break
            case '500':
                if (this._fivehundredImageDetails.hasOwnProperty('is_new')) {
                    this._fivehundredImageDetails = null;
                }
                else {
                    this._fivehundredImageDetails['is_deleted'] = true;
                }
                break;
            case '404':

                if (this._fournotfourImageDetails.hasOwnProperty('is_new')) {
                    this._fournotfourImageDetails = null;
                }
                else {
                    this._fournotfourImageDetails['is_deleted'] = true;
                }
                break
            case '403':

                if (this._fournotthreeImageDetails.hasOwnProperty('is_new')) {
                    this._fournotthreeImageDetails = null;
                }
                else {
                    this._fournotthreeImageDetails['is_deleted'] = true;
                }
                break
            case 'header-logo':

                if (this._headerlogoImageDetails.hasOwnProperty('is_new')) {
                    this._headerlogoImageDetails = null;
                }
                else {
                    this._headerlogoImageDetails['is_deleted'] = true;
                }
                break
            case 'loader':

                if (this._loaderImageDetails.hasOwnProperty('is_new')) {
                    this._loaderImageDetails = null;
                }
                else {
                    this._loaderImageDetails['is_deleted'] = true;
                }
                break
        }

    }

    removeDeletedElement(){
        
        if (this._headerlogoImageDetails?.is_deleted) {
            this._headerlogoImageDetails = null;
          return this._headerlogoImageDetails;
        }
        if (this._loaderImageDetails?.is_deleted) {
            this._loaderImageDetails = null;
            return this._loaderImageDetails;
        }
        if (this._discussioniconImageDetails?.is_deleted) {
            this._discussioniconImageDetails = null;
          return this._discussioniconImageDetails;
        }
        if (this._faviconImageDetails?.is_deleted) {
            this._faviconImageDetails = null;
            return this._faviconImageDetails;
        }
        if (this._emptybarchartImageDetails?.is_deleted) {
            this._emptybarchartImageDetails = null;
          return this._emptybarchartImageDetails;
        }
        if (this._emptypichartImageDetails?.is_deleted) {
            this._emptypichartImageDetails = null;
            return this._emptypichartImageDetails;
        }
        if (this._emptyscreenImageDetails?.is_deleted) {
            this._emptyscreenImageDetails = null;
          return this._emptyscreenImageDetails;
        }
        if (this._fournotfourImageDetails?.is_deleted) {
            this._fournotfourImageDetails = null;
            return this._fournotfourImageDetails;
        }
        if (this._fournotthreeImageDetails?.is_deleted) {
            this._fournotthreeImageDetails = null;
          return this._fournotthreeImageDetails;
        }
        if (this._fivehundredImageDetails?.is_deleted) {
            this._fivehundredImageDetails = null;
            return this._fivehundredImageDetails;
        }
      }

    setStructureDetails(response) {
        this._structureDetails = response.data;
    }

    setStructureDetailsById(response) {
        this._structureDetailsById = response;
    }

    @computed
    get structureDetails() {
        return this._structureDetails;
    }

    @computed
    get structureDetailsById() {
        return this._structureDetailsById;
    }

     // images get start
     @computed
     get discussionIconImageDetails() {
         return this._discussioniconImageDetails;
     }
 
     @computed
     get emptyBarImageDetails() {
         return this._emptybarchartImageDetails;
     }
 
     @computed
     get emptyScreenImageDetails() {
         return this._emptyscreenImageDetails;
     }
 
     @computed
     get emptyPIChartImageDetails() {
         return this._emptypichartImageDetails;
     }
 
     @computed
     get favIconImageDetails() {
         return this._faviconImageDetails;
     }

    @computed
    get fiveHundredImageDetails() {
        return this._fivehundredImageDetails;
    }

    @computed
    get fourNotFourImageDetails() {
        return this._fournotfourImageDetails;
    }

    @computed
    get fourNotThreeImageDetails() {
        return this._fournotthreeImageDetails;
    }

    @computed
    get loaderImageDetails() {
        return this._loaderImageDetails;
    }

    @computed
    get headerLogoImageDetails() {
        return this._headerlogoImageDetails;
    }

    @action
    setThemeStructureObject(type:string, url: string){
        this.themeStructureObject[type] = url;
    }
}
export const ThemeStructureSettingStore = new Store();